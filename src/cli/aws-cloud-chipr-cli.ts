import { Command, Option, OptionValues } from 'commander'
import ora from 'ora'
import { Output, OutputFormats, SubCommands, SubCommandsDetail } from '../constants'
import { EnvHelper, FilterHelper, OutputHelper, PromptHelper } from '../helpers'
import { OutputService } from '../services/output/output-service'
import {
  AwsSubCommand,
  AWSShellEngineAdapter,
  Command as CloudChiprCommand,
  SubCommandInterface,
  ProviderResource,
  Response, Ebs, Ec2, Elb, Nlb, Alb, Eip, Rds
} from '@cloudchipr/cloudchipr-engine'
import CloudChiprCliInterface from './cloud-chipr-cli-interface'
import chalk from 'chalk'
import ResponseDecorator from '../responses/response-decorator'
import EngineRequestBuilderFactory from '../requests/engine-request-builder-factory'

export default class AwsCloudChiprCli implements CloudChiprCliInterface {
  private responseDecorator: ResponseDecorator
  readonly AWS_DEFAULT_REGION = 'us-east-1'

  constructor () {
    this.responseDecorator = new ResponseDecorator()
  }

  customiseCommand (command: Command): CloudChiprCliInterface {
    command
      .addOption(new Option('--region <string...>', 'Region, default uses value of AWS_DEFAULT_REGION env variable').default([]))
      .addOption(new Option('--account-id <string...>', 'Account id').default([]))
      .addOption(new Option('--profile <profile>', 'Profile, default uses value of AWS_PROFILE env variable'))

    return this
  }

  customiseCollectCommand (command: Command): CloudChiprCliInterface {
    const parentOptions = command.parent.opts()

    for (const key in SubCommandsDetail) {
      command
        .command(key)
        .description(SubCommandsDetail[key].collectDescription)
        .option('-f, --filter <type>', 'Filter')
        .action(async (options) => {
          const response = await this.executeCollectCommand([key as SubCommands], parentOptions, options)
          this.printCollectResponse(response, key, parentOptions.output, parentOptions.outputFormat)
        })
        .addHelpText('after', FilterHelper.getFilterExample(key))
    }

    command
      .command('all')
      .description('Collect app resources based on the specified filters')
      .action(async (options) => {
        const response = await this.executeCollectCommand(Object.values(SubCommands), parentOptions, options)
        this.printCollectResponse(response, 'all', parentOptions.output, parentOptions.outputFormat)
      })

    return this
  }

  customiseCleanCommand (command: Command): CloudChiprCliInterface {
    const parentOptions = command.parent.opts()

    for (const key in SubCommandsDetail) {
      command
        .command(key)
        .description(SubCommandsDetail[key].cleanDescription)
        .option('--yes', `To terminate ${key.toUpperCase()} specific information without confirmation`)
        .option('-f, --filter <type>', 'Filter')
        .action(async (options) => {
          await this.executeCleanCommand([key as SubCommands], parentOptions, options)
        })
        .addHelpText('after', FilterHelper.getFilterExample(key))
    }

    command
      .command('all')
      .description('Terminate all resources from a cloud provider')
      .option('--yes', 'To terminate all resources specific information without confirmation')
      .action(async (options) => {
        await this.executeCleanCommand(Object.values(SubCommands), parentOptions, options)
      })

    return this
  }

  // customiseNukeCommand (command: Command): CloudChiprCliInterface {
  //   return this
  // }

  private async executeCollectCommand (subCommands: SubCommands[], parentOptions: OptionValues, options: OptionValues): Promise<Response<ProviderResource>[]> {
    const spinner = ora('CloudChipr is now collecting data. This might take some time...').start()
    try {
      const promises = []
      for (const subCommand of subCommands) {
        const allOptions = Object.assign(parentOptions, { filter: options.filter || FilterHelper.getDefaultFilterPath(subCommand) }) as OptionValues
        const providerResource = AwsCloudChiprCli.getProviderResourceFromString(subCommand)
        promises.push(this.executeCommand<InstanceType<typeof providerResource>>(CloudChiprCommand.collect(), AwsSubCommand[subCommand](), allOptions))
      }
      const response = await Promise.all(promises)
      spinner.succeed()
      return response
    } catch (e) {
      spinner.fail()
      throw e
    }
  }

  private async executeCleanCommand (subCommands: SubCommands[], parentOptions: OptionValues, options: OptionValues) {
    const collectResponse = await this.executeCollectCommand(subCommands, parentOptions, options)
    this.printCollectResponse(collectResponse, '', Output.DETAILED, OutputFormats.TABLE, false)
    const ids = {}
    let found = false
    collectResponse.forEach((response) => {
      if (response.count === 0) {
        return
      }
      found = true
      const subCommand = response.items[0].constructor.name.toLowerCase()
      ids[subCommand] = this.responseDecorator.getIds(response, subCommand)
    })
    if (!found || (!options.yes && !(await PromptHelper.prompt('All resources listed above will be deleted. Are you sure you want to proceed? ')))) {
      return
    }
    const spinner = ora('CloudChipr is now cleaning the resources. This might take some time...').start()
    try {
      const promises = []
      for (const key in ids) {
        const providerResource = AwsCloudChiprCli.getProviderResourceFromString(key)
        promises.push(this.executeCommand<InstanceType<typeof providerResource>>(CloudChiprCommand.clean(), AwsSubCommand[key](), parentOptions, ids[key]))
      }
      const cleanResponse = await Promise.all(promises)
      spinner.succeed()
      this.printCleanResponse(cleanResponse, ids)
      OutputHelper.link('Star CloudChipr CLI on GitHub', 'https://github.com/cloudchipr/cli')
    } catch (e) {
      spinner.fail()
      throw e
    }
  }

  private async executeCommand<T> (command: CloudChiprCommand, subcommand: SubCommandInterface, options: OptionValues, ids: string[] = []): Promise<Response<T>> {
    const request = EngineRequestBuilderFactory
      .getInstance(command)
      .setSubCommand(subcommand)
      .setOptions(options)
      .setIds(ids)
      .build()

    if (options.profile !== undefined) {
      EnvHelper.setEnvironmentVariable('AWS_PROFILE', options.profile)
    }

    if (!EnvHelper.getEnvironmentVariable('AWS_DEFAULT_REGION')) {
      EnvHelper.setEnvironmentVariable('AWS_DEFAULT_REGION', this.AWS_DEFAULT_REGION)
    }

    const custodianOrg = (options.accountId !== undefined && (new Set(options.accountId)).size) ? EnvHelper.getCustodianOrg() : undefined

    const engineAdapter = new AWSShellEngineAdapter<T>(EnvHelper.getCustodian(), custodianOrg)
    return engineAdapter.execute(request)
  }

  private printCollectResponse (responses: Response<ProviderResource>[], target: string, output?: string, outputFormat?: string, showCleanCommandSuggestion: boolean = true) {
    let found = false
    let summaryData = []
    responses.forEach((response) => {
      if (response.count === 0) {
        return
      }
      found = true
      if (output === Output.DETAILED || output === null) {
        OutputService.print(`${response.items[0].constructor.name.toUpperCase()} - Potential saving opportunities found ⬇️`, OutputFormats.TEXT, { type: 'success' })
        OutputService.print(this.responseDecorator.decorate([response], Output.DETAILED), outputFormat, { showTopBorder: true, showBottomBorder: true })
      }
      if (output === Output.SUMMARIZED || output === null) {
        summaryData = [...summaryData, ...this.responseDecorator.decorate([response], Output.SUMMARIZED)]
      }
    })
    if (summaryData.length > 0) {
      OutputService.print(this.responseDecorator.sortByPriceSummary(summaryData), outputFormat)
    }
    if (found && showCleanCommandSuggestion) {
      OutputService.print(`Please run ${chalk.bgHex('#F7F7F7').hex('#D16464')('c8r clean [options] ' + target)} with the same filters if you wish to clean.`, OutputFormats.TEXT)
    } else if (!found) {
      OutputService.print('We found no resources matching provided filters, please modify and try again!', OutputFormats.TEXT, { type: 'warning' })
    }
  }

  private printCleanResponse (responses: Response<ProviderResource>[], ids: object) {
    let price = 0
    let found = false
    responses.forEach((response) => {
      if (response.count === 0) {
        return
      }
      found = true
      const subCommand = response.items[0].constructor.name.toLowerCase()
      const decoratedData = this.responseDecorator.decorateClean(response, ids[subCommand], subCommand)
      OutputService.print(decoratedData.data, OutputFormats.ROW_DELETE)
      price += decoratedData.price
    })
    if (found) {
      OutputService.print(`All done, you just saved ${String(chalk.green(this.responseDecorator.formatPrice(price)))} per month!!!`, OutputFormats.TEXT, { type: 'superSuccess' })
    } else {
      OutputService.print(this.responseDecorator.decorateCleanFailure(ids), OutputFormats.ROW_DELETE)
    }
  }

  static getProviderResourceFromString (target: string) {
    switch (target) {
      case SubCommands.EBS:
        return Ebs
      case SubCommands.EC2:
        return Ec2
      case SubCommands.ELB:
        return Elb
      case SubCommands.NLB:
        return Nlb
      case SubCommands.ALB:
        return Alb
      case SubCommands.EIP:
        return Eip
      case SubCommands.RDS:
        return Rds
    }
  }
}

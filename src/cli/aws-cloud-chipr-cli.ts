import { Command, Option, OptionValues } from 'commander'
import ora from 'ora'
import { Output, OutputFormats, SubCommands, SubCommandsDetail } from '../constants'
import { EnvHelper, FilterHelper } from '../helpers'
import { PromptHelper } from '../helpers/prompt-helper'
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
          const response = await AwsCloudChiprCli.executeCollectCommand([key as SubCommands], parentOptions, options)
          this.printCollectResponse(response, key, parentOptions.output, parentOptions.outputFormat)
        })
        .addHelpText('after', AwsCloudChiprCli.getFilterExample(key))
    }

    command
      .command('all')
      .description('Collect app resources based on the specified filters')
      .option('-f, --filter <type>', 'Filter')
      .action(async (options) => {
        const response = await AwsCloudChiprCli.executeCollectCommand(Object.values(SubCommands), parentOptions, options)
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
        .option('--force', 'Force')
        .option('-f, --filter <type>', 'Filter')
        .action(async (options) => {
          await this.executeCleanCommand([key as SubCommands], parentOptions, options)
        })
        .addHelpText('after', AwsCloudChiprCli.getFilterExample(key))
    }

    command
      .command('all')
      .description('Terminate all resources from a cloud provider')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action(async (options) => {
        await this.executeCleanCommand(Object.values(SubCommands), parentOptions, options)
      })

    return this
  }

  // customiseNukeCommand (command: Command): CloudChiprCliInterface {
  //   return this
  // }

  private static async executeCollectCommand (subCommands: SubCommands[], parentOptions: OptionValues, options: OptionValues): Promise<Response<ProviderResource>[]> {
    const spinner = ora('CloudChipr is now collecting data. This might take some time...').start();
    try {
      const promises = []
      for (const subCommand of subCommands) {
        const allOptions = Object.assign(parentOptions, { filter: options.filter || `./default-filters/${subCommand}.yaml` }) as OptionValues
        const providerResource = AwsCloudChiprCli.getProviderResourceFromString(subCommand)
        promises.push(AwsCloudChiprCli.executeCommand<InstanceType<typeof providerResource>>(CloudChiprCommand.collect(), AwsSubCommand[subCommand](), allOptions))
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
    const collectResponse = await AwsCloudChiprCli.executeCollectCommand(subCommands, parentOptions, options)
    const ids = {}
    let found = false
    collectResponse.forEach((response) => {
      if (response.count === 0) {
        return
      }
      found = true
      const subCommand = response.items[0].constructor.name.toLowerCase();
      ids[subCommand] = this.responseDecorator.getIds(response, subCommand)
    })
    if (!found) {
      OutputService.print('We found no resources matching provided filters, please modify and try again!', OutputFormats.TEXT, { type: 'warning' })
      return
    }
    let confirm = true
    if (!options.force) {
      this.printCollectResponse(collectResponse, '', Output.DETAILED, OutputFormats.TABLE, false)
      confirm = await PromptHelper.prompt('All resources listed above will be deleted. Are you sure you want to proceed? ')
    }
    if (!confirm) {
      return
    }
    const spinner = ora('CloudChipr is now cleaning the resources. This might take some time...').start();
    try {
      const promises = []
      for (const key in ids) {
        const providerResource = AwsCloudChiprCli.getProviderResourceFromString(key)
        promises.push(AwsCloudChiprCli.executeCommand<InstanceType<typeof providerResource>>(CloudChiprCommand.clean(), AwsSubCommand[key](), options, ids[key]))
      }
      const cleanResponse = await Promise.all(promises)
      let price = 0
      spinner.succeed()
      cleanResponse.forEach((response) => {
        if (response.count === 0) {
          return
        }
        const subCommand = response.items[0].constructor.name.toLowerCase();
        const decoratedData = this.responseDecorator.decorateClean(response, ids[subCommand], subCommand)
        OutputService.print(decoratedData.data, OutputFormats.ROW_DELETE)
        price += decoratedData.price
      })
      OutputService.print(`All done, you just saved ${String(chalk.green(this.responseDecorator.formatPrice(price)))} per month!!!`, OutputFormats.TEXT, { type: 'superSuccess' })
    } catch (e) {
      spinner.fail()
      throw e
    }
  }

  private static async executeCommand<T> (command: CloudChiprCommand, subcommand: SubCommandInterface, options: OptionValues, ids: string[] = []): Promise<Response<T>> {
    const request = EngineRequestBuilderFactory
      .getInstance(command)
      .setSubCommand(subcommand)
      .setOptions(options)
      .setIds(ids)
      .build()

    if (options.profile !== undefined) {
      EnvHelper.setEnvironmentVariable('AWS_PROFILE', options.profile)
    }

    const custodianOrg = (options['accountId'] != undefined && (new Set(options['accountId'])).size) ? EnvHelper.getCustodianOrg(): undefined

    const engineAdapter = new AWSShellEngineAdapter<T>(EnvHelper.getCustodian(), custodianOrg)
    return engineAdapter.execute(request)
  }

  private printCollectResponse(responses: Response<ProviderResource>[], target: string, output?: string, outputFormat?: string, showCleanCommandSuggestion: boolean = true) {
    let found = false
    let summaryData = []
    responses.forEach((response) => {
      if (response.count === 0) {
        return
      }
      found = true
      if (output === Output.DETAILED || output === null) {
        OutputService.print(`${response.items[0].constructor.name.toUpperCase()} - Potential saving cutting opportunities found ⬇️`, OutputFormats.TEXT, { type: 'success' })
        OutputService.print(this.responseDecorator.decorate([response], Output.DETAILED), outputFormat, {showTopBorder: true, showBottomBorder: true})
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
      OutputService.print('We found no resources matching provided filters, please modify and try again!', OutputFormats.TEXT, {type: 'warning'})
    }
  }

  static getFilterExample (subcommand: string): string {
    return `\n${chalk.yellow('Filter example (filter.yaml)')}:\n${FilterHelper.getDefaultFilter(subcommand)}`
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

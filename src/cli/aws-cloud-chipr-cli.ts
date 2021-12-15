import { Command, Option, OptionValues } from 'commander'
import { Output, OutputFormats, SubCommands, SubCommandsDetail } from '../constants'
import { EnvHelper, FilterHelper } from '../helpers'
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
import inquirer from 'inquirer'
import chalk from 'chalk'
import ResponseDecorator from '../responses/response-decorator'
import EngineRequestBuilderFactory from '../requests/engine-request-builder-factory'

export default class AwsCloudChiprCli implements CloudChiprCliInterface {
  private responseDecorator: ResponseDecorator
  readonly AWS_DEFAULT_REGION = 'us-east-1';

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
          const providerResource = AwsCloudChiprCli.getProviderResourceFromString(key)
          const allOptions = Object.assign(parentOptions, { filter: options.filter || `./default-filters/${key}.yaml` }) as OptionValues
          const response = await this.executeCommand<InstanceType<typeof providerResource>>(CloudChiprCommand.collect(), AwsSubCommand[key](), allOptions)
          this.printCollectResponse([response], key, parentOptions.output, parentOptions.outputFormat)
        })
        .addHelpText('after', AwsCloudChiprCli.getFilterExample(key))
    }

    command
      .command('all')
      .description('Collect app resources based on the specified filters')
      .option('-f, --filter <type>', 'Filter')
      .action(async () => {
        const promises = []
        for (const key in SubCommandsDetail) {
          const allOptions = Object.assign(parentOptions, { filter: `./default-filters/${key}.yaml` }) as OptionValues
          const providerResource = AwsCloudChiprCli.getProviderResourceFromString(key)
          promises.push(this.executeCommand<InstanceType<typeof providerResource>>(CloudChiprCommand.collect(), AwsSubCommand[key](), allOptions))
        }
        Promise.all(promises)
          .then(result => {
            this.printCollectResponse(result, 'all', parentOptions.output, parentOptions.outputFormat)
          })
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
          await this.executeSingleCleanCommandWithPrompt(key, parentOptions, options)
        })
        .addHelpText('after', AwsCloudChiprCli.getFilterExample(key))
    }

    command
      .command('all')
      .description('Terminate all resources from a cloud provider')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action(async () => {
        OutputService.print(`[Clean All] command is not implemented yet!`, OutputFormats.TEXT, { type: 'info' })
      })

    return this
  }

  // customiseNukeCommand (command: Command): CloudChiprCliInterface {
  //   return this
  // }

  private async executeSingleCleanCommandWithPrompt (target: string, parentOptions: OptionValues, options: any) {
    const providerResource = AwsCloudChiprCli.getProviderResourceFromString(target)
    const allOptions = Object.assign(parentOptions, { filter: options.filter || `./default-filters/${target}.yaml` }) as OptionValues
    const collect = await this.executeCommand<InstanceType<typeof providerResource>>(CloudChiprCommand.collect(), AwsSubCommand[target](), allOptions)
    if (collect.count === 0) {
      OutputService.print('We found no resources matching provided filters, please modify and try again!', OutputFormats.TEXT, { type: 'warning' })
      return
    }
    let confirm = true
    if (!options.force) {
      OutputService.print(this.responseDecorator.decorate([collect], Output.DETAILED), OutputFormats.TABLE)
      confirm = await this.prompt(AwsSubCommand[target]().getValue())
    }
    if (confirm) {
      await this.executeCleanCommand<InstanceType<typeof providerResource>>(AwsSubCommand[target](), collect, parentOptions)
    }
  }

  private async executeCleanCommand<T extends ProviderResource> (subcommand: SubCommandInterface, collect: Response<ProviderResource>, options: OptionValues) {
    const ids = this.responseDecorator.getIds(collect, subcommand.getValue())
    const response = await this.executeCommand<T>(CloudChiprCommand.clean(), subcommand, options, ids)
    const decoratedData = this.responseDecorator.decorateClean(response, ids, subcommand.getValue())
    OutputService.print(decoratedData.data, OutputFormats.ROW_DELETE)
    OutputService.print(`All done, you just saved ${String(chalk.green(decoratedData.price))} per month!!!`, OutputFormats.TEXT, { type: 'superSuccess' })
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

    const custodianOrg = (options['accountId'] != undefined && (new Set(options['accountId'])).size) ? EnvHelper.getCustodianOrg(): undefined

    const engineAdapter = new AWSShellEngineAdapter<T>(EnvHelper.getCustodian(), custodianOrg)
    return engineAdapter.execute(request)
  }

  private async prompt (subcommand: string): Promise<boolean> {
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        prefix: '',
        message: `All resources listed above will be deleted. Are you sure you want to proceed? `
      }
    ])
    return !!confirm.proceed
  }

  private printCollectResponse(responses: Response<ProviderResource>[], target: string, output?: string, outputFormat?: string) {
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
    if (found) {
      OutputService.print(`Please run ${chalk.bgHex('#F7F7F7').hex('#D16464')('c8r clean [options] ' + target)} with the same filters if you wish to clean.`, OutputFormats.TEXT)
    } else {
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

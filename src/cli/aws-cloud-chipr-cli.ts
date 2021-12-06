import { Command, Option, OptionValues } from 'commander'
import { Output, OutputFormats, SubCommandsDetail } from '../constants'
import { OutputService } from '../services/output/output-service'
import {
  AwsSubCommand,
  AWSShellEngineAdapter,
  Command as CloudChiprCommand,
  SubCommandInterface,
  ProviderResource,
  Response
} from '@cloudchipr/cloudchipr-engine'
import CloudChiprCliInterface from './cloud-chipr-cli-interface'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { FilterHelper } from '../helpers/filter-helper'
import ResponseDecorator from '../responses/response-decorator'
import EngineRequestBuilderFactory from '../requests/engine-request-builder-factory'
import { AwsHelper } from '../helpers/aws-helper'
import {CustodianHelper} from '../helpers/custodian-helper'

export default class AwsCloudChiprCli implements CloudChiprCliInterface {
  private responseDecorator: ResponseDecorator

  constructor () {
    this.responseDecorator = new ResponseDecorator()
  }

  customiseCommand (command: Command): CloudChiprCliInterface {
    command
      .addOption(new Option('--region <string...>', 'Region, default uses value of AWS_REGION env variable').default([]))
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
          await this.executeSingleCollectCommand(key, parentOptions, options)
        })
        .addHelpText('after', this.getFilterExample(key))
    }

    command
      .command('all')
      .description('Collect app resources based on the specified filters')
      .option('-f, --filter <type>', 'Filter')
      .action(async () => {
        await this
          .executeAllCollectCommand(parentOptions)
          .then(result => {
            const responses: Array<Response<ProviderResource>> = result
            if (parentOptions.output !== Output.SUMMARIZED) {
              responses.forEach((response) => {
                if (response.count === 0) {
                  return
                }
                OutputService.print(`${response.items[0].constructor.name.toUpperCase()} ⬇️`, OutputFormats.TEXT, { type: 'success' })
                const context = {
                  showTopBorder: true,
                  showBottomBorder: true
                }
                OutputService.print(this.responseDecorator.decorate([response], Output.DETAILED), parentOptions.outputFormat, context)
              })
            }
            if (parentOptions.output !== Output.DETAILED) {
              OutputService.print(this.responseDecorator.decorate(responses, Output.SUMMARIZED), parentOptions.outputFormat)
            }
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
        .addHelpText('after', this.getFilterExample(key))
    }

    return this
  }

  // customiseNukeCommand (command: Command): CloudChiprCliInterface {
  //   return this
  // }

  private async executeSingleCollectCommand (target: string, parentOptions: OptionValues, options: any) {
    const providerResource = AwsHelper.getProviderResourceFromString(target)
    const allOptions = Object.assign(parentOptions, { filter: options.filter || `./default-filters/${target}.yaml` }) as OptionValues
    const response = await this.executeCollectCommand<InstanceType<typeof providerResource>>(AwsSubCommand[target](), allOptions)
    if (response.count === 0) {
      OutputService.print('We found no resources matching provided filters, please modify and try again!', OutputFormats.TEXT, { type: 'warning' })
      return
    }
    if (parentOptions.output !== null) {
      OutputService.print(this.responseDecorator.decorate([response], parentOptions.output), parentOptions.outputFormat)
    } else {
      OutputService.print(this.responseDecorator.decorate([response], Output.DETAILED), parentOptions.outputFormat)
      OutputService.print(this.responseDecorator.decorate([response], Output.SUMMARIZED), parentOptions.outputFormat)
    }
  }

  private executeAllCollectCommand (parentOptions: OptionValues) {
    const promises = []
    for (const key in SubCommandsDetail) {
      const allOptions = Object.assign(parentOptions, { filter: `./default-filters/${key}.yaml` }) as OptionValues
      const providerResource = AwsHelper.getProviderResourceFromString(key)
      promises.push(this.executeCollectCommand<InstanceType<typeof providerResource>>(AwsSubCommand[key](), allOptions))
    }
    return Promise.all(promises)
  }

  private executeCollectCommand<T extends ProviderResource> (subcommand: SubCommandInterface, options: OptionValues): Promise<Response<T>> {
    return this.executeCommand<T>(CloudChiprCommand.collect(), subcommand, options)
  }

  private async executeSingleCleanCommandWithPrompt (target: string, parentOptions: OptionValues, options: any) {
    const providerResource = AwsHelper.getProviderResourceFromString(target)
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

    if (!Array.isArray(options) && options.profile !== undefined) {
      process.env.AWS_PROFILE = options.profile
    }

    const custodianOrg = (options['accountId'] != undefined && (new Set(options['accountId'])).size)? CustodianHelper.getCustodianOrg(): undefined

    const engineAdapter = new AWSShellEngineAdapter<T>(CustodianHelper.getCustodian(), custodianOrg)
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

  private getFilterExample (subcommand: string): string {
    return `\n${chalk.yellow('Filter example (filter.yaml)')}:\n${FilterHelper.getDefaultFilter(subcommand)}`
  }
}

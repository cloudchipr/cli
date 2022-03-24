import {
  GcpSql,
  GcpDisks,
  GcpEip,
  GcpLb,
  GcpVm,
  SubCommandInterface,
  Command as CloudChiprCommand,
  GcpShellEngineAdapter,
  ProviderResource,
  Response,
  GcpSubCommand
} from '@cloudchipr/cloudchipr-engine'
import { Command, Option, OptionValues } from 'commander'
import ora from 'ora'
import { CloudProvider, GcpSubCommands, GcpSubCommandsDetail, Output, OutputFormats } from '../constants'
import { EnvHelper, FilterHelper, OutputHelper, PromptHelper } from '../helpers'
import EngineRequestBuilderFactory from '../requests/engine-request-builder-factory'
import CloudChiprCliInterface from './cloud-chipr-cli-interface'
import fs from 'fs'
import EngineRequestBuilder from '../requests/engine-request-builder'
import CloudChiprCli from './cloud-chipr-cli'

export default class GcpCloudChiprCli extends CloudChiprCli implements CloudChiprCliInterface {
  customiseCommand (command: Command): CloudChiprCliInterface {
    command
      .addOption(new Option('--region <string...>', 'Region, some description').default([]))
      .addOption(new Option('--project <profile>', 'Project, some description').env('PORT'))

    return this
  }

  customiseCollectCommand (command: Command): CloudChiprCliInterface {
    const parentOptions = command.parent.opts()

    for (const key in GcpSubCommandsDetail) {
      command
        .command(key)
        .description(GcpSubCommandsDetail[key].collectDescription)
        .option('-f, --filter <type>', 'Filter')
        .action(async (options) => {
          const response = await this.executeCollectCommand([key as GcpSubCommands], parentOptions, options)
          this.responsePrint.printCollectResponse(response, CloudProvider.GCP, key, parentOptions.output, parentOptions.outputFormat)
        })
        .addHelpText('after', FilterHelper.getFilterExample(CloudProvider.GCP, key))
        .hook('postAction', async () => {
          if (parentOptions.verbose !== true) {
            await fs.promises.rm(`${EngineRequestBuilder.outputDirectory}`, { recursive: true, force: true })
          }
        })
    }

    command
      .command('all')
      .description('Collect app resources based on the specified filters')
      .action(async (options) => {
        const response = await this.executeCollectCommand(Object.values(GcpSubCommands), parentOptions, options)
        this.responsePrint.printCollectResponse(response, CloudProvider.GCP, 'all', parentOptions.output, parentOptions.outputFormat)
      })
      .hook('postAction', async () => {
        if (parentOptions.verbose !== true) {
          await fs.promises.rm(`${EngineRequestBuilder.outputDirectory}`, { recursive: true, force: true })
        }
      })

    return this
  }

  customiseCleanCommand (command: Command): CloudChiprCliInterface {
    const parentOptions = command.parent.opts()

    for (const key in GcpSubCommandsDetail) {
      command
        .command(key)
        .description(GcpSubCommandsDetail[key].cleanDescription)
        .option('--yes', `To terminate ${key.toUpperCase()} specific information without confirmation`)
        .option('-f, --filter <type>', 'Filter')
        .action(async (options) => {
          await this.executeCleanCommand([key as GcpSubCommands], parentOptions, options)
        })
        .addHelpText('after', FilterHelper.getFilterExample(CloudProvider.GCP, key))
        .hook('postAction', async () => {
          if (parentOptions.verbose !== true) {
            await fs.promises.rm(`${EngineRequestBuilder.outputDirectory}`, { recursive: true, force: true })
          }
        })
    }

    command
      .command('all')
      .description('Terminate all resources from a cloud provider')
      .option('--yes', 'To terminate all resources specific information without confirmation')
      .action(async (options) => {
        await this.executeCleanCommand(Object.values(GcpSubCommands), parentOptions, options)
      })
      .hook('postAction', async () => {
        if (parentOptions.verbose !== true) {
          await fs.promises.rm(`${EngineRequestBuilder.outputDirectory}`, { recursive: true, force: true })
        }
      })

    return this
  }

  private async executeCollectCommand (subCommands: GcpSubCommands[], parentOptions: OptionValues, options: OptionValues): Promise<Response<ProviderResource>[]> {
    const spinner = ora('CloudChipr is now collecting data. This might take some time...').start()
    try {
      const promises = []
      for (const subCommand of subCommands) {
        const allOptions = Object.assign(parentOptions, { filter: options.filter || FilterHelper.getDefaultFilterPath(CloudProvider.GCP, subCommand) }) as OptionValues
        const providerResource = GcpCloudChiprCli.getProviderResourceFromString(subCommand)
        promises.push(this.executeCommand<InstanceType<typeof providerResource>>(CloudChiprCommand.collect(), GcpSubCommand[subCommand](), allOptions))
      }
      const response = await Promise.all(promises)
      spinner.succeed()
      return response
    } catch (e) {
      spinner.fail()
      throw e
    }
  }

  private async executeCleanCommand (subCommands: GcpSubCommands[], parentOptions: OptionValues, options: OptionValues) {
    const collectResponse = await this.executeCollectCommand(subCommands, parentOptions, options)
    this.responsePrint.printCollectResponse(collectResponse, CloudProvider.GCP, '', Output.DETAILED, OutputFormats.TABLE, false)
    const ids = {}
    let found = false
    collectResponse.forEach((response) => {
      if (response.count === 0) {
        return
      }
      found = true
      const subCommand = response.items[0].constructor.name
      ids[subCommand.toLowerCase()] = this.responseDecorator.getIds(CloudProvider.GCP, response, subCommand)
    })
    if (!found || (!options.yes && !(await PromptHelper.prompt('All resources listed above will be deleted. Are you sure you want to proceed? ')))) {
      return
    }
    const spinner = ora('CloudChipr is now cleaning the resources. This might take some time...').start()
    try {
      const promises = []
      for (const key in ids) {
        const providerResource = GcpCloudChiprCli.getProviderResourceFromString(key)
        promises.push(this.executeCommand<InstanceType<typeof providerResource>>(CloudChiprCommand.clean(), GcpSubCommand[key](), parentOptions, ids[key]))
      }
      const cleanResponse = await Promise.all(promises)
      spinner.succeed()
      this.responsePrint.printCleanResponse(cleanResponse, CloudProvider.GCP, ids)
      OutputHelper.link('Please Star us on Github', 'https://github.com/cloudchipr/cli')
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

    const custodianOrg = (options.accountId !== undefined && (new Set(options.accountId)).size) ? EnvHelper.getCustodianOrg() : undefined

    const engineAdapter = new GcpShellEngineAdapter<T>(EnvHelper.getCustodian(), custodianOrg)
    return engineAdapter.execute(request)
  }

  static getProviderResourceFromString (target: string) {
    switch (target) {
      case GcpSubCommands.VM:
        return GcpVm
      case GcpSubCommands.DISKS:
        return GcpDisks
      case GcpSubCommands.EIP:
        return GcpEip
      case GcpSubCommands.SQL:
        return GcpSql
      case GcpSubCommands.LB:
        return GcpLb
    }
  }
}

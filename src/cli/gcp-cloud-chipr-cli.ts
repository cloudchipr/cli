import {
  GcpCloudSql,
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
import { Disks } from '@cloudchipr/cloudchipr-engine/lib/domain/types/gcp/disks'
import { Vm } from '@cloudchipr/cloudchipr-engine/lib/domain/types/gcp/vm'
import { Command, Option, OptionValues } from 'commander'
import ora from 'ora'
import { CloudProvider, GcpSubCommands, GcpSubCommandsDetail } from '../constants'
import {EnvHelper, FilterHelper, OutputHelper } from '../helpers'
import EngineRequestBuilderFactory from '../requests/engine-request-builder-factory'
import CloudChiprCliInterface from './cloud-chipr-cli-interface'

export default class GcpCloudChiprCli implements CloudChiprCliInterface {
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
          OutputHelper.text('Coming soon!', 'info')
        })
        .addHelpText('after', FilterHelper.getFilterExample(CloudProvider.GCP, key))
    }

    command
      .command('all')
      .description('Collect app resources based on the specified filters')
      .action(async (options) => {
        OutputHelper.text('Coming soon!', 'info')
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
          OutputHelper.text('Coming soon!', 'info')
        })
        .addHelpText('after', FilterHelper.getFilterExample(CloudProvider.GCP, key))
    }

    command
      .command('all')
      .description('Terminate all resources from a cloud provider')
      .option('--yes', 'To terminate all resources specific information without confirmation')
      .action(async (options) => {
        OutputHelper.text('Coming soon!', 'info')
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

  private async executeCommand<T> (command: CloudChiprCommand, subcommand: SubCommandInterface, options: OptionValues, ids: string[] = []): Promise<Response<T>> {
    const request = EngineRequestBuilderFactory
        .getInstance(command)
        .setSubCommand(subcommand)
        .setOptions(options)
        .setIds(ids)
        .build()

    console.log(request)

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
      case GcpSubCommands.CLOUD_SQL:
        return GcpCloudSql
      case GcpSubCommands.LB:
        return GcpLb
    }
  }
}

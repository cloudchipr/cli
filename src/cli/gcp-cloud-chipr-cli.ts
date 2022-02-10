import { Command, Option } from 'commander'
import { CloudProvider, GcpSubCommandsDetail } from '../constants'
import { FilterHelper, OutputHelper } from '../helpers'
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
}

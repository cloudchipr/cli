import { Command, Option, OptionValues } from 'commander'
import ora from 'ora'
import { Output, OutputFormats, AwsSubCommands, AwsSubCommandsDetail, CloudProvider } from '../constants'
import { EnvHelper, FilterHelper, OutputHelper, PromptHelper } from '../helpers'
import {
  AwsSubCommand,
  AWSShellEngineAdapter,
  Command as CloudChiprCommand,
  SubCommandInterface,
  ProviderResource,
  Response, Ebs, Ec2, Elb, Nlb, Alb, Eip, Rds
} from '@cloudchipr/cloudchipr-engine'
import CloudChiprCliInterface from './cloud-chipr-cli-interface'
import EngineRequestBuilderFactory from '../requests/engine-request-builder-factory'
import fs from 'fs'
import EngineRequestBuilder from '../requests/engine-request-builder'
import CloudChiprCli from './cloud-chipr-cli'

export default class AwsCloudChiprCli extends CloudChiprCli implements CloudChiprCliInterface {
  readonly AWS_DEFAULT_REGION = 'us-east-1'

  customiseCommand (command: Command): CloudChiprCliInterface {
    command
      .addOption(new Option('--region <string...>', 'Region, default uses value of AWS_DEFAULT_REGION env variable').default([]))
      .addOption(new Option('--account-id <string...>', 'Account id').default([]))
      .addOption(new Option('--profile <profile>', 'Profile, default uses value of AWS_PROFILE env variable'))

    return this
  }

  customiseCollectCommand (command: Command): CloudChiprCliInterface {
    const parentOptions = command.parent.opts()

    for (const key in AwsSubCommandsDetail) {
      command
        .command(key)
        .description(AwsSubCommandsDetail[key].collectDescription)
        .option('-f, --filter <type>', 'Filter')
        .action(async (options) => {
          const response = await this.executeCollectCommand([key as AwsSubCommands], parentOptions, options)
          this.responsePrint.printCollectResponse(response, CloudProvider.AWS, key, parentOptions.output, parentOptions.outputFormat)
        })
        .addHelpText('after', FilterHelper.getFilterExample(CloudProvider.AWS, key))
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
        const response = await this.executeCollectCommand(Object.values(AwsSubCommands), parentOptions, options)
        this.responsePrint.printCollectResponse(response, CloudProvider.AWS, 'all', parentOptions.output, parentOptions.outputFormat)
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

    for (const key in AwsSubCommandsDetail) {
      command
        .command(key)
        .description(AwsSubCommandsDetail[key].cleanDescription)
        .option('--yes', `To terminate ${key.toUpperCase()} specific information without confirmation`)
        .option('-f, --filter <type>', 'Filter')
        .action(async (options) => {
          await this.executeCleanCommand([key as AwsSubCommands], parentOptions, options)
        })
        .addHelpText('after', FilterHelper.getFilterExample(CloudProvider.AWS, key))
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
        await this.executeCleanCommand(Object.values(AwsSubCommands), parentOptions, options)
      })
      .hook('postAction', async () => {
        if (parentOptions.verbose !== true) {
          await fs.promises.rm(`${EngineRequestBuilder.outputDirectory}`, { recursive: true, force: true })
        }
      })

    return this
  }

  // customiseNukeCommand (command: Command): CloudChiprCliInterface {
  //   return this
  // }

  private async executeCollectCommand (subCommands: AwsSubCommands[], parentOptions: OptionValues, options: OptionValues): Promise<Response<ProviderResource>[]> {
    const spinner = ora('CloudChipr is now collecting data. This might take some time...').start()
    try {
      const promises = []
      for (const subCommand of subCommands) {
        const allOptions = Object.assign(parentOptions, { filter: options.filter || FilterHelper.getDefaultFilterPath(CloudProvider.AWS, subCommand) }) as OptionValues
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

  private async executeCleanCommand (subCommands: AwsSubCommands[], parentOptions: OptionValues, options: OptionValues) {
    const collectResponse = await this.executeCollectCommand(subCommands, parentOptions, options)
    this.responsePrint.printCollectResponse(collectResponse, CloudProvider.AWS, '', Output.DETAILED, OutputFormats.TABLE, false)
    const ids = {}
    let found = false
    collectResponse.forEach((response) => {
      if (response.count === 0) {
        return
      }
      found = true
      const subCommand = response.items[0].constructor.name
      ids[subCommand.toLowerCase()] = this.responseDecorator.getIds(CloudProvider.AWS, response, subCommand)
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
      this.responsePrint.printCleanResponse(cleanResponse, CloudProvider.AWS, ids)
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

  static getProviderResourceFromString (target: string) {
    switch (target) {
      case AwsSubCommands.EBS:
        return Ebs
      case AwsSubCommands.EC2:
        return Ec2
      case AwsSubCommands.ELB:
        return Elb
      case AwsSubCommands.NLB:
        return Nlb
      case AwsSubCommands.ALB:
        return Alb
      case AwsSubCommands.EIP:
        return Eip
      case AwsSubCommands.RDS:
        return Rds
    }
  }
}

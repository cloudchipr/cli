import { Command, Option, OptionValues } from 'commander'
import { Output, OutputFormats } from '../constants'
import { OutputService } from '../services/output/output-service'
import EngineRequestBuilder from '../engine-request-builder'
import {
  AwsSubCommand,
  AWSShellEngineAdapter,
  Command as CloudChiprCommand,
  Ec2, Ebs, Elb, Nlb, Alb, Eip, Rds, SubCommandInterface, ProviderResource,
  Response
} from '@cloudchipr/cloudchipr-engine'
import CloudChiprCliInterface from './cloud-chipr-cli-interface'
import inquirer from 'inquirer'
import CollectResponseDecorator from '../responses/collect-response-decorator'
import chalk from 'chalk'
import { FilterHelper } from '../helpers/filter-helper'
import CollectAllSummaryDecorator from '../responses/collect-all-summary-decorator'
const fs = require('fs')

export default class AwsCloudChiprCli implements CloudChiprCliInterface {
  customiseCommand (command: Command): CloudChiprCliInterface {
    command
      .addOption(new Option('--region <string...>', 'Region, default uses value of AWS_REGION env variable').default([]))
      .addOption(new Option('--account-id <account-id>', 'Account id'))
      .addOption(new Option('--profile <profile>', 'Profile, default uses value of AWS_PROFILE env variable'))

    return this
  }

  customiseCollectCommand (command: Command): CloudChiprCliInterface {
    const parentOptions = command.parent.opts()
    command
      .command('ebs')
      .description('Collect EBS volumes specific information based on provided filters.')
      .option('-f, --filter <type>', 'Filter')
      .action(async (options) => {
        await AwsCloudChiprCli.executeAndOutputCollectCommand<Ebs>(
          AwsSubCommand.ebs(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/ebs.yaml' }) as OptionValues,
          parentOptions.outputFormat
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('ebs'))

    command
      .command('ec2')
      .description('Collect EC2 instance specific information based on provided filters.')
      .option('-f, --filter <type>', 'Filter')
      .action(async (options) => {
        await AwsCloudChiprCli.executeAndOutputCollectCommand<Ec2>(
          AwsSubCommand.ec2(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/ec2.yaml' }) as OptionValues,
          parentOptions.outputFormat
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('ec2'))

    command
      .command('elb')
      .description('Collect ELB specific information based on provided filters.')
      .option('-f, --filter <type>', 'Filter')
      .action(async (options) => {
        await AwsCloudChiprCli.executeAndOutputCollectCommand<Elb>(
          AwsSubCommand.elb(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/elb.yaml' }) as OptionValues,
          parentOptions.outputFormat
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('elb'))

    command
      .command('nlb')
      .description('Collect NLB specific information based on provided filters.')
      .option('-f, --filter <type>', 'Filter')
      .action(async (options) => {
        await AwsCloudChiprCli.executeAndOutputCollectCommand<Nlb>(
          AwsSubCommand.nlb(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/nlb.yaml' }) as OptionValues,
          parentOptions.outputFormat
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('nlb'))

    command
      .command('alb')
      .description('Collect ALB specific information based on provided filters.')
      .option('-f, --filter <type>', 'Filter')
      .action(async (options) => {
        await AwsCloudChiprCli.executeAndOutputCollectCommand<Alb>(
          AwsSubCommand.alb(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/alb.yaml' }) as OptionValues,
          parentOptions.outputFormat
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('alb'))

    command
      .command('eip')
      .description('Collect EIP specific information based on provided filters.')
      .option('-f, --filter <type>', 'Filter')
      .action(async (options) => {
        await AwsCloudChiprCli.executeAndOutputCollectCommand<Eip>(
          AwsSubCommand.eip(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/eip.yaml' }) as OptionValues,
          parentOptions.outputFormat
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('eip'))

    command
      .command('rds')
      .description('Collect RDS database specific information based on provided filters.')
      .option('-f, --filter <type>', 'Filter')
      .action(async (options) => {
        await AwsCloudChiprCli.executeAndOutputCollectCommand<Rds>(
          AwsSubCommand.rds(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/rds.yaml' }) as OptionValues,
          parentOptions.outputFormat
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('rds'))

    command
      .command('all')
      .description('Collect app resources based on the specified filters')
      .option('-f, --filter <type>', 'Filter')
      .action(() => {
        Promise.all([
          AwsCloudChiprCli.executeCollectCommand<Ebs>(
            AwsSubCommand.ebs(),
          Object.assign(parentOptions, { filter: './default-filters/ebs.yaml' }) as OptionValues
          ),
          AwsCloudChiprCli.executeCollectCommand<Ec2>(
            AwsSubCommand.ec2(),
          Object.assign(parentOptions, { filter: './default-filters/ec2.yaml' }) as OptionValues
          ),
          AwsCloudChiprCli.executeCollectCommand<Eip>(
            AwsSubCommand.eip(),
          Object.assign(parentOptions, { filter: './default-filters/eip.yaml' }) as OptionValues
          ),
          AwsCloudChiprCli.executeCollectCommand<Alb>(
            AwsSubCommand.alb(),
          Object.assign(parentOptions, { filter: './default-filters/alb.yaml' }) as OptionValues
          ),
          AwsCloudChiprCli.executeCollectCommand<Elb>(
            AwsSubCommand.elb(),
          Object.assign(parentOptions, { filter: './default-filters/elb.yaml' }) as OptionValues
          ),
          AwsCloudChiprCli.executeCollectCommand<Nlb>(
            AwsSubCommand.nlb(),
          Object.assign(parentOptions, { filter: './default-filters/nlb.yaml' }) as OptionValues
          ),
          AwsCloudChiprCli.executeCollectCommand<Rds>(
            AwsSubCommand.rds(),
          Object.assign(parentOptions, { filter: './default-filters/rds.yaml' }) as OptionValues
          )]
        ).then(result => {
          const responses: Array<Response<ProviderResource>> = result
          if (parentOptions.output === Output.SUMMARIZED) {
            AwsCloudChiprCli.outputCollectCommandSummary(responses, parentOptions.outputFormat)
          } else {
            responses.forEach(response => {
              AwsCloudChiprCli.outputCollectCommand(response, parentOptions.outputFormat)
            })
          }
        })
      })

    return this
  }

  customiseCleanCommand (command: Command): CloudChiprCliInterface {
    const parentOptions = command.parent.opts()
    command
      .command('ebs')
      .description('Terminate EBS volumes specific information based on provided filters.')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action(async (options) => {
        await this.executeCleanCommandWithPrompt<Ebs>(
          AwsSubCommand.ebs(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/ebs.yaml' }) as OptionValues,
          options.force
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('ebs'))

    command
      .command('ec2')
      .description('Terminate EC2 instance specific information based on provided filters.')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action(async (options) => {
        await this.executeCleanCommandWithPrompt<Ec2>(
          AwsSubCommand.ec2(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/ec2.yaml' }) as OptionValues,
          options.force
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('ec2'))

    command
      .command('elb')
      .description('Terminate ELB specific information based on provided filters.')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action(async (options) => {
        await this.executeCleanCommandWithPrompt<Elb>(
          AwsSubCommand.elb(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/elb.yaml' }) as OptionValues,
          options.force
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('elb'))

    command
      .command('nlb')
      .description('Terminate NLB specific information based on provided filters.')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action(async (options) => {
        await this.executeCleanCommandWithPrompt<Nlb>(
          AwsSubCommand.nlb(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/nlb.yaml' }) as OptionValues,
          options.force
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('nlb'))

    command
      .command('alb')
      .description('Terminate ALB specific information based on provided filters.')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action(async (options) => {
        await this.executeCleanCommandWithPrompt<Alb>(
          AwsSubCommand.alb(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/alb.yaml' }) as OptionValues,
          options.force
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('alb'))

    command
      .command('eip')
      .description('Terminate EIP specific information based on provided filters.')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action(async (options) => {
        await this.executeCleanCommandWithPrompt<Eip>(
          AwsSubCommand.eip(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/eip.yaml' }) as OptionValues,
          options.force
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('eip'))

    command
      .command('rds')
      .description('Terminate RDS database specific information based on provided filters.')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action(async (options) => {
        await this.executeCleanCommandWithPrompt<Rds>(
          AwsSubCommand.rds(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/rds.yaml' }) as OptionValues,
          options.force
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('rds'))

    return this
  }

  // customiseNukeCommand (command: Command): CloudChiprCliInterface {
  //   return this
  // }

  private static executeCollectCommand<T extends ProviderResource> (subcommand: SubCommandInterface, options: OptionValues): Promise<Response<T>> {
    return AwsCloudChiprCli.executeCommand<T>(CloudChiprCommand.collect(), subcommand, options)
  }

  private static outputCollectCommand<T extends ProviderResource> (response: Response<T>, outputFormat: string) {
    AwsCloudChiprCli.output((new CollectResponseDecorator()).decorate(response.items), outputFormat)
  }

  private static outputCollectCommandSummary (response: Array<Response<ProviderResource>>, outputFormat: string) {
    AwsCloudChiprCli.output((new CollectAllSummaryDecorator()).decorate(response), outputFormat)
  }

  private static async executeAndOutputCollectCommand<T extends ProviderResource> (subcommand: SubCommandInterface, options: OptionValues, outputFormat: string) {
    const response = await AwsCloudChiprCli.executeCollectCommand<T>(subcommand, options)
    await AwsCloudChiprCli.outputCollectCommand<T>(response, outputFormat)
  }

  private static async executeCleanCommand<T extends ProviderResource> (subcommand: SubCommandInterface, options: OptionValues, collect: any[]) {
    const response = await AwsCloudChiprCli.executeCommand<T>(CloudChiprCommand.clean(), subcommand, options)
    const decoratedData = (new CollectResponseDecorator()).decorateClean(response.items, collect, subcommand.getValue())
    AwsCloudChiprCli.output(decoratedData.data, OutputFormats.ROW_DELETE)
    AwsCloudChiprCli.output(`All done, you just saved ${String(chalk.hex('#00FF00')(decoratedData.price))} per month!!!`)
  }

  private async executeCleanCommandWithPrompt<T extends ProviderResource> (subcommand: SubCommandInterface, options: OptionValues, force: boolean) {
    const collect = await AwsCloudChiprCli.executeCommand<T>(CloudChiprCommand.collect(), subcommand, options)
    if (collect.count === 0) {
      AwsCloudChiprCli.output('Nothing to clean now, please try again later!', OutputFormats.TEXT)
      return
    }
    if (force) {
      await AwsCloudChiprCli.executeCleanCommand<T>(subcommand, options, collect.items)
      return
    }
    AwsCloudChiprCli.output((new CollectResponseDecorator()).decorate(collect.items), OutputFormats.TABLE)
    AwsCloudChiprCli.prompt(subcommand.getValue()).then((confirm) => {
      if (confirm) {
        AwsCloudChiprCli.executeCleanCommand<T>(subcommand, options, collect.items)
      }
    })
  }

  private static async executeCommand<T> (command: CloudChiprCommand, subcommand: SubCommandInterface, options: OptionValues): Promise<Response<T>> {
    const request = EngineRequestBuilder
      .builder()
      .setOptions(options)
      .setCommand(command)
      .setSubCommand(subcommand)
      .build()

    if (options.profile !== undefined) {
      process.env.AWS_PROFILE = options.profile
    }

    const engineAdapter = new AWSShellEngineAdapter<T>(this.getCustodian())
    return engineAdapter.execute(request)
  }

  private static async prompt (subcommand: string): Promise<boolean> {
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        prefix: '',
        message: `All ${subcommand.toUpperCase()} volumes listed above will be deleted. Are you sure you want to proceed? `
      }
    ])
    return !!confirm.proceed
  }

  private static output (items: any, format?: string): void {
    (new OutputService()).print(items, format)
  }

  private static getFilterExample (subcommand: string): string {
    return `\n${chalk.yellow('Filter example (filter.yaml)')}:\n${FilterHelper.getDefaultFilter(subcommand)}`
  }

  // check if C8R_CUSTODIAN is provided and executable
  private static getCustodian (): string {
    const custodian: string = process.env.C8R_CUSTODIAN
    if (custodian === undefined) {
      throw new Error('C8R_CUSTODIAN is not provided')
    }

    try {
      fs.accessSync(custodian)
    } catch (err) {
      throw new Error('C8R_CUSTODIAN is not provided or it not executable')
    }

    return custodian
  }
}

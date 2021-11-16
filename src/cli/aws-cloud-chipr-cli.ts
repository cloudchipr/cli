import { Command, Option, OptionValues } from 'commander'
import { OutputFormats } from '../constants'
import { OutputService } from '../services/output/output-service'
import EngineRequestBuilder from '../engine-request-builder'
import {
  AwsSubCommand,
  AWSShellEngineAdapter,
  Command as CloudChiprCommand,
  Ec2, Ebs, Elb, Nlb, Alb, Eip, Rds, SubCommandInterface, ProviderResource
} from '@cloudchipr/cloudchipr-engine'
import CloudChiprCliInterface from './cloud-chipr-cli-interface'
import inquirer from 'inquirer'
import CollectResponseDecorator from '../responses/collect-response-decorator'
import chalk from 'chalk'
import { FilterHelper } from '../helpers/filter-helper'
const fs = require('fs')

export default class AwsCloudChiprCli implements CloudChiprCliInterface {
  customiseCommand (command: Command): CloudChiprCliInterface {
    command
      .addOption(new Option('--region <region>', 'Region, default uses value of AWS_REGION env variable'))
      .addOption(new Option('--account-id <account-id>', 'Account id'))
      .addOption(new Option('--profile <profile>', 'Profile, default uses value of AWS_PROFILE env variable'))

    return this
  }

  customiseCollectCommand (command: Command): CloudChiprCliInterface {
    const parentOptions = command.parent.opts()
    command
      .command('ebs')
      .description('Display AWS Elastic Block Store (EBS) based on the specified filters')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        AwsCloudChiprCli.executeCollectCommand<Ebs>(
          AwsSubCommand.ebs(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/ebs.yaml' }) as OptionValues,
          parentOptions.outputFormat
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('ebs'))

    command
      .command('ec2')
      .description('Display AWS Elastic Computing (EC2) resources based on the specified filters')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        AwsCloudChiprCli.executeCollectCommand<Ec2>(
          AwsSubCommand.ec2(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/ec2.yaml' }) as OptionValues,
          parentOptions.outputFormat
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('ec2'))

    command
      .command('elb')
      .description('Display AWS Elastic Load Balancing (ELB) resources based on the specified filters')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        AwsCloudChiprCli.executeCollectCommand<Elb>(
          AwsSubCommand.elb(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/elb.yaml' }) as OptionValues,
          parentOptions.outputFormat
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('elb'))

    command
      .command('nlb')
      .description('Display AWS Network Load Balancing (NLB) resources based on the specified filters')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        AwsCloudChiprCli.executeCollectCommand<Nlb>(
          AwsSubCommand.nlb(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/nlb.yaml' }) as OptionValues,
          parentOptions.outputFormat
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('nlb'))

    command
      .command('alb')
      .description('Display AWS Application Load Balancing (ALB) resources based on the specified filters')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        AwsCloudChiprCli.executeCollectCommand<Alb>(
          AwsSubCommand.alb(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/alb.yaml' }) as OptionValues,
          parentOptions.outputFormat
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('alb'))

    command
      .command('eip')
      .description('Display AWS Elastic IP addresses (EIP) resources based on the specified filters')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        AwsCloudChiprCli.executeCollectCommand<Eip>(
          AwsSubCommand.eip(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/eip.yaml' }) as OptionValues,
          parentOptions.outputFormat
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('eip'))

    command
      .command('rds')
      .description('Display AWS Relational Database Service (RDS) resources based on the specified filters')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        AwsCloudChiprCli.executeCollectCommand<Rds>(
          AwsSubCommand.rds(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/rds.yaml' }) as OptionValues,
          parentOptions.outputFormat
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('rds'))

    return this
  }

  customiseCleanCommand (command: Command): CloudChiprCliInterface {
    const parentOptions = command.parent.opts()
    command
      .command('ebs')
      .description('Remove AWS Elastic Block Store (EBS) resources based on the specified filters')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCleanCommandWithPrompt<Ebs>(
          AwsSubCommand.ebs(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/ebs.yaml' }) as OptionValues,
          parentOptions.outputFormat,
          options.force
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('ebs'))

    command
      .command('ec2')
      .description('Remove AWS Elastic Computing (EC2) resources based on the specified filters')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCleanCommandWithPrompt<Ec2>(
          AwsSubCommand.ec2(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/ec2.yaml' }) as OptionValues,
          parentOptions.outputFormat,
          options.force
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('ec2'))

    command
      .command('elb')
      .description('Remove AWS Elastic Load Balancing (ELB) resources based on the specified filters')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCleanCommandWithPrompt<Elb>(
          AwsSubCommand.elb(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/elb.yaml' }) as OptionValues,
          parentOptions.outputFormat,
          options.force
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('elb'))

    command
      .command('nlb')
      .description('Remove AWS Network Load Balancing (NLB) resources based on the specified filters')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCleanCommandWithPrompt<Nlb>(
          AwsSubCommand.nlb(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/nlb.yaml' }) as OptionValues,
          parentOptions.outputFormat,
          options.force
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('nlb'))

    command
      .command('alb')
      .description('Remove AWS Application Load Balancing (ALB) resources based on the specified filters')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCleanCommandWithPrompt<Alb>(
          AwsSubCommand.alb(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/alb.yaml' }) as OptionValues,
          parentOptions.outputFormat,
          options.force
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('alb'))

    command
      .command('eip')
      .description('Remove AWS Elastic IP addresses (EIP) resources based on the specified filters')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCleanCommandWithPrompt<Eip>(
          AwsSubCommand.eip(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/eip.yaml' }) as OptionValues,
          parentOptions.outputFormat,
          options.force
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('eip'))

    command
      .command('rds')
      .description('Remove AWS Relational Database Service (RDS) resources based on the specified filters')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCleanCommandWithPrompt<Rds>(
          AwsSubCommand.rds(),
          Object.assign(parentOptions, { filter: options.filter || './default-filters/rds.yaml' }) as OptionValues,
          parentOptions.outputFormat,
          options.force
        )
      })
      .addHelpText('after', AwsCloudChiprCli.getFilterExample('rds'))

    return this
  }

  // customiseNukeCommand (command: Command): CloudChiprCliInterface {
  //   return this
  // }

  private static async executeCollectCommand<T extends ProviderResource> (subcommand: SubCommandInterface, options: OptionValues, outputFormat: string) {
    const response = await AwsCloudChiprCli.executeCommand<T>(CloudChiprCommand.collect(), subcommand, options)

    AwsCloudChiprCli.output((new CollectResponseDecorator()).decorate(response.items), outputFormat)
  }

  private static async executeCleanCommand<T extends ProviderResource> (subcommand: SubCommandInterface, options: OptionValues, collect: any[]) {
    const response = await AwsCloudChiprCli.executeCommand<T>(CloudChiprCommand.clean(), subcommand, options)
    const decoratedData = (new CollectResponseDecorator()).decorateClean(response.items, collect, subcommand.getValue())
    AwsCloudChiprCli.output(decoratedData.data, OutputFormats.ROW_DELETE)
    AwsCloudChiprCli.output(`All done, you just saved ${chalk.hex('#00FF00')(decoratedData.price)} per month!!!`)
  }

  private async executeCleanCommandWithPrompt<T extends ProviderResource> (subcommand: SubCommandInterface, options: OptionValues, outputFormat: string, force: boolean) {
    const collect = await AwsCloudChiprCli.executeCommand<T>(CloudChiprCommand.collect(), subcommand, options)
    if (collect.count === 0) {
      AwsCloudChiprCli.output('Nothing to clean now, please try again later!', OutputFormats.TEXT)
      return
    }
    if (force) {
      await AwsCloudChiprCli.executeCleanCommand<T>(subcommand, options, collect.items)
      return
    }
    AwsCloudChiprCli.output((new CollectResponseDecorator()).decorate(collect.items), outputFormat)
    AwsCloudChiprCli.prompt().then((confirm) => {
      if (confirm) {
        AwsCloudChiprCli.executeCleanCommand<T>(subcommand, options, collect.items)
      }
    })
  }

  private static async executeCommand<T> (command: CloudChiprCommand, subcommand: SubCommandInterface, options: OptionValues) {
    const request = EngineRequestBuilder
      .builder()
      .setOptions(options)
      .setCommand(command)
      .setSubCommand(subcommand)
      .build()

    if (options.profile !== undefined) {
      process.env.AWS_PROFILE = options.profile
    }

    if (options.region !== undefined) {
      process.env.AWS_REGION = options.region
    }

    const engineAdapter = new AWSShellEngineAdapter<T>(this.getCustodian())
    return engineAdapter.execute(request)
  }

  private static async prompt (): Promise<boolean> {
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'All Instances will be deleted, Are you sure you want to proceed? '
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

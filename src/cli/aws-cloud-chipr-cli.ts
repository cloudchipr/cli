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
import chalk from 'chalk'
import { FilterHelper } from '../helpers/filter-helper'
import ResponseDecorator from '../responses/response-decorator'
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
          parentOptions.outputFormat,
          parentOptions.output
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
          parentOptions.outputFormat,
          parentOptions.output
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
          parentOptions.outputFormat,
          parentOptions.output
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
          parentOptions.outputFormat,
          parentOptions.output
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
          parentOptions.outputFormat,
          parentOptions.output
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
          parentOptions.outputFormat,
          parentOptions.output
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
          parentOptions.outputFormat,
          parentOptions.output
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
            AwsCloudChiprCli.output((new ResponseDecorator()).decorate(responses, Output.SUMMARIZED), parentOptions.outputFormat)
          } else {
            responses.forEach((response) => {
              if (response.count === 0) {
                return
              }
              AwsCloudChiprCli.output(`✅️ ${response.items[0].constructor.name.toUpperCase()} ⬇️`, OutputFormats.TEXT)
              const context = {
                showTopBorder: true,
                showBottomBorder: true
              }
              AwsCloudChiprCli.output((new ResponseDecorator()).decorate([response], Output.DETAILED), parentOptions.outputFormat, context)
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

  private static async executeAndOutputCollectCommand<T extends ProviderResource> (subcommand: SubCommandInterface, options: OptionValues, outputFormat: string, output: string) {
    const response = await AwsCloudChiprCli.executeCollectCommand<T>(subcommand, options)
    if (response.count === 0) {
      AwsCloudChiprCli.output('🟡 ' + chalk.hex('#FFD800')('We found no resources matching provided filters, please modify and try again!'), OutputFormats.TEXT)
    } else {
      AwsCloudChiprCli.output((new ResponseDecorator()).decorate([response], output), outputFormat)
    }
  }

  private static executeCollectCommand<T extends ProviderResource> (subcommand: SubCommandInterface, options: OptionValues): Promise<Response<T>> {
    return AwsCloudChiprCli.executeCommand<T>(CloudChiprCommand.collect(), subcommand, options)
  }

  private async executeCleanCommandWithPrompt<T extends ProviderResource> (subcommand: SubCommandInterface, options: OptionValues, force: boolean) {
    const collect = await AwsCloudChiprCli.executeCommand<T>(CloudChiprCommand.collect(), subcommand, options)
    if (collect.count === 0) {
      AwsCloudChiprCli.output('🟡 ' + chalk.hex('#FFD800')('We found no resources matching provided filters, please modify and try again!'), OutputFormats.TEXT)
      return
    }
    if (force) {
      await AwsCloudChiprCli.executeCleanCommand<T>(subcommand, options, collect.items)
      return
    }
    AwsCloudChiprCli.output((new ResponseDecorator()).decorate([collect], Output.DETAILED), OutputFormats.TABLE)
    AwsCloudChiprCli.prompt(subcommand.getValue()).then((confirm) => {
      if (confirm) {
        AwsCloudChiprCli.executeCleanCommand<T>(subcommand, options, collect.items)
      }
    })
  }

  private static async executeCleanCommand<T extends ProviderResource> (subcommand: SubCommandInterface, options: OptionValues, collect: any[]) {
    const response = await AwsCloudChiprCli.executeCommand<T>(CloudChiprCommand.clean(), subcommand, options)
    const decoratedData = (new ResponseDecorator()).decorateClean(response.items, collect, subcommand.getValue())
    AwsCloudChiprCli.output(decoratedData.data, OutputFormats.ROW_DELETE)
    AwsCloudChiprCli.output(`🎉🎉🎉 All done, you just saved ${String(chalk.hex('#00FF00')(decoratedData.price))} per month!!!`)
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

  private static output (items: any, format?: string, context: object = {}): void {
    (new OutputService()).print(items, format, context)
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

import { Command, Option, OptionValues } from 'commander'
import {OutputFormats, Profile} from '../constants'
import { OutputService } from '../services/output/output-service'
import EngineRequestBuilder from '../engine-request-builder'
import {
  AwsSubCommand,
  AWSShellEngineAdapter,
  Command as CloudChiprCommand,
  Ec2, Ebs, Elb, Nlb, Alb, Eip, Rds, SubCommandInterface
} from '@cloudchipr/cloudchipr-engine'
import CloudChiprCliInterface from './cloud-chipr-cli-interface'
import inquirer from 'inquirer'
import chalk from 'chalk'

export default class AwsCloudChiprCli implements CloudChiprCliInterface {
  customiseCommand (command: Command): CloudChiprCliInterface {
    command
      .addOption(new Option('--account-id <account-id>', 'Account id'))
      .addOption(new Option('--profile <profile>', 'Profile').default(Profile.DEFAULT))

    return this
  }

  customiseCollectCommand (command: Command): CloudChiprCliInterface {
    const parentOptions = command.parent.opts()
    command
      .command('ebs')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCollectCommand<Ebs>(
          AwsSubCommand.ebs(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat
        )
      })

    command
      .command('ec2')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCollectCommand<Ec2>(
          AwsSubCommand.ec2(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat
        )
      })

    command
      .command('elb')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCollectCommand<Elb>(
          AwsSubCommand.elb(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat
        )
      })

    command
      .command('nlb')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCollectCommand<Nlb>(
          AwsSubCommand.nlb(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat
        )
      })

    command
      .command('alb')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCollectCommand<Alb>(
          AwsSubCommand.alb(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat
        )
      })

    command
      .command('eip')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCollectCommand<Eip>(
          AwsSubCommand.eip(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat
        )
      })

    command
      .command('rds')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCollectCommand<Rds>(
          AwsSubCommand.rds(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat
        )
      })

    return this
  }

  customiseCleanCommand (command: Command): CloudChiprCliInterface {
    const parentOptions = command.parent.opts()
    command
      .command('ebs')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCleanCommandWithPrompt<Ebs>(
          AwsSubCommand.ebs(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat,
          options.force
        )
      })

    command
      .command('ec2')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCleanCommandWithPrompt<Ec2>(
          AwsSubCommand.ec2(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat,
          options.force
        )
      })

    command
      .command('elb')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCleanCommandWithPrompt<Elb>(
          AwsSubCommand.elb(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat,
          options.force
        )
      })

    command
      .command('nlb')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCleanCommandWithPrompt<Nlb>(
          AwsSubCommand.nlb(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat,
          options.force
        )
      })

    command
      .command('alb')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCleanCommandWithPrompt<Alb>(
          AwsSubCommand.alb(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat,
          options.force
        )
      })

    command
      .command('eip')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCleanCommandWithPrompt<Eip>(
          AwsSubCommand.eip(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat,
          options.force
        )
      })

    command
      .command('rds')
      .option('--force', 'Force')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        this.executeCleanCommandWithPrompt<Rds>(
          AwsSubCommand.rds(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat,
          options.force
        )
      })

    return this
  }

  // customiseNukeCommand (command: Command): CloudChiprCliInterface {
  //   return this
  // }

  private executeCollectCommand<T> (subcommand: SubCommandInterface, options: OptionValues, outputFormat: string) {
    const response = this.executeCommand<T>(CloudChiprCommand.collect(), subcommand, options)
    this.output(response.items, outputFormat)
  }

  private executeCleanCommand<T> (subcommand: SubCommandInterface, options: OptionValues, collect: any[]) {
    const response = this.executeCommand<T>(CloudChiprCommand.clean(), subcommand, options)
    const cleanedDataIds = []
    const cleanedData = response.items.map(item => {
      cleanedDataIds.push(Object.values(item)[0])
      return {
        command: subcommand.getValue(),
        instanceId: Object.values(item)[0],
        result: 1
      }
    })
    this.output(cleanedData, OutputFormats.ROW_DELETE)
    const failedData = collect.filter(item => !cleanedDataIds.includes(Object.values(item)[0])).map(item => {
      cleanedDataIds.push(Object.values(item)[0])
      return {
        command: subcommand.getValue(),
        instanceId: Object.values(item)[0],
        result: 0
      }
    })
    this.output(failedData, OutputFormats.ROW_DELETE)
    this.output(`All done, you just saved ${chalk.hex('#00FF00')('xxx')} per month!!!`)
  }

  private executeCleanCommandWithPrompt<T> (subcommand: SubCommandInterface, options: OptionValues, outputFormat: string, force: boolean) {
    const collect = this.executeCommand<T>(CloudChiprCommand.collect(), subcommand, options)
    if (collect.count === 0) {
      this.output('Nothing to clean now, please try again later!', OutputFormats.TEXT)
      return
    }
    if (force) {
      this.executeCleanCommand<T>(subcommand, options, collect.items)
      return
    }
    this.output(collect.items, outputFormat)
    this.prompt().then((confirm) => {
      if (confirm) {
        this.executeCleanCommand<T>(subcommand, options, collect.items)
      }
    })
  }

  private executeCommand<T> (command: CloudChiprCommand, subcommand: SubCommandInterface, options: OptionValues) {
    const request = EngineRequestBuilder
      .builder()
      .setOptions(options)
      .setCommand(command)
      .setSubCommand(subcommand)
      .build()
    const engineAdapter = new AWSShellEngineAdapter<T>(process.env.C8R_CUSTODIAN as string)
    return engineAdapter.execute(request)
  }

  private async prompt (): Promise<boolean> {
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'All Instances will be deleted, Are you sure you want to proceed? '
      }
    ])
    return !!confirm.proceed
  }

  private output (items: any, format?: string): void {
    (new OutputService()).print(items, format)
  }
}

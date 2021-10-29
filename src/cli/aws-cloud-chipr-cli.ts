import { Command, Option, OptionValues } from 'commander'
import { Profile } from '../constants'
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
        AwsCloudChiprCli.executeCollectCommand<Ebs>(
          AwsSubCommand.ebs(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat
        )
      })

    command
      .command('ec2')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        AwsCloudChiprCli.executeCollectCommand<Ec2>(
          AwsSubCommand.ec2(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat
        )
      })

    command
      .command('elb')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        AwsCloudChiprCli.executeCollectCommand<Elb>(
          AwsSubCommand.elb(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat
        )
      })

    command
      .command('nlb')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        AwsCloudChiprCli.executeCollectCommand<Nlb>(
          AwsSubCommand.nlb(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat
        )
      })

    command
      .command('alb')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        AwsCloudChiprCli.executeCollectCommand<Alb>(
          AwsSubCommand.alb(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat
        )
      })

    command
      .command('eip')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        AwsCloudChiprCli.executeCollectCommand<Eip>(
          AwsSubCommand.eip(),
          Object.assign(parentOptions, { filter: options.filter }) as OptionValues,
          parentOptions.outputFormat
        )
      })

    command
      .command('rds')
      .option('-f, --filter <type>', 'Filter')
      .action((options) => {
        AwsCloudChiprCli.executeCollectCommand<Rds>(
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

  private static executeCollectCommand<T> (subcommand: SubCommandInterface, options: OptionValues, outputFormat: string) {
    const response = AwsCloudChiprCli.executeCommand<T>(CloudChiprCommand.collect(), subcommand, options)
    AwsCloudChiprCli.output(response.items, outputFormat)
  }

  private static executeCleanCommand<T> (subcommand: SubCommandInterface, options: OptionValues, outputFormat: string) {
    const response = AwsCloudChiprCli.executeCommand<T>(CloudChiprCommand.clean(), subcommand, options)
    AwsCloudChiprCli.output(response.items, outputFormat)
  }

  private executeCleanCommandWithPrompt<T> (subcommand: SubCommandInterface, options: OptionValues, outputFormat: string, force: boolean) {
    if (force) {
      AwsCloudChiprCli.executeCleanCommand<T>(subcommand, options, outputFormat)
      return
    }
    AwsCloudChiprCli.executeCollectCommand<T>(subcommand, options, outputFormat)
    AwsCloudChiprCli.prompt().then((confirm) => {
      if (confirm) {
        AwsCloudChiprCli.executeCleanCommand<T>(subcommand, options, outputFormat)
      }
    })
  }

  private static executeCommand<T> (command: CloudChiprCommand, subcommand: SubCommandInterface, options: OptionValues) {
    const request = EngineRequestBuilder
      .builder()
      .setOptions(options)
      .setCommand(command)
      .setSubCommand(subcommand)
      .build()
    const engineAdapter = new AWSShellEngineAdapter<T>(process.env.C8R_CUSTODIAN as string)
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

  private static output (items: any[], format: string): void {
    (new OutputService()).print(items, format)
  }
}

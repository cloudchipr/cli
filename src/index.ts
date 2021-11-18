#!/usr/bin/env node

import chalk from 'chalk'
import { Command, Option } from 'commander'
import { CloudProvider, Output, OutputFormats } from './constants'
import CloudChiprCliProvider from './cli/cloud-chipr-cli-provider'
import {LoadingMessageHelper} from "./helpers/loading-message-helper";
require('dotenv').config()
import * as readline from 'readline'

const command = new Command()
command
  .description('CloudChipr CLI')
  .addOption(new Option('--cloud-provider <cloud-provider>', 'Cloud provider').default(CloudProvider.AWS).choices(Object.values(CloudProvider)))
  .addOption(new Option('--verbose <verbose>', 'Verbose').default(0))
  .addOption(new Option('--version <version>', 'Version'))
  .addOption(new Option('--dry-run <dry-run>', 'Dry run'))
  .addOption(new Option('--output <output>', 'Output').default(Output.DETAILED).choices(Object.values(Output)))
  .addOption(new Option('--output-format <output-format>', 'Output format').default(OutputFormats.TABLE).choices(Object.values(OutputFormats)))
  .showSuggestionAfterError()
  .hook('preAction', (thisCommand) => {
    // here we need to start the spinner
    const message = LoadingMessageHelper.getLoadingMessage(thisCommand.args[0] ?? '', thisCommand.args[1] ?? '')
    if (message !== '') {
      console.log(chalk.green(message))
    }
  })
  .hook('postAction', () => {
    // here we need to stop and remove the spinner
    console.log('Command ends *******')
  })

const collect = command.command('collect').description('Display resources based on the specified subcommand and options')
collect
  .command('all')
  .description('Display app resources based on the specified filters')
  .option('-f, --filter <type>', 'Filter')

const clean = command.command('clean').description('Remove resources from a cloud provider based on the specified subcommand and options')
clean
  .command('all')
  .description('Remove all resources from a cloud provider')
  .option('-f, --filter <type>', 'Filter')

const cloudChiprCli = CloudChiprCliProvider.getProvider(command.opts().cloudProvider)
cloudChiprCli
  .customiseCommand(command)
  .customiseCollectCommand(collect)
  .customiseCleanCommand(clean)

try {
  command.parseAsync(process.argv).catch(e => {
    console.error(chalk.red(chalk.underline('Error:'), e.message))
  })
} catch (e) {
  console.error(chalk.red(chalk.underline('Error:'), e.message))
}

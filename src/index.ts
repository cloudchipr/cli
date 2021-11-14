#!/usr/bin/env node

import chalk from 'chalk'
import { Command, Option } from 'commander'
import { CloudProvider, Output, OutputFormats, Region } from './constants'
import CloudChiprCliProvider from './cli/cloud-chipr-cli-provider'
require('dotenv').config()

const command = new Command()
command
  .description('A good description for CloudChipr CLI')
  .addOption(new Option('--cloud-provider <cloud-provider>', 'Cloud provider').default(CloudProvider.AWS).choices(Object.values(CloudProvider)))
  .addOption(new Option('--region <region>', 'Region').default(Region.US_EAST_1))
  .addOption(new Option('--verbose <verbose>', 'Verbose').default(0))
  .addOption(new Option('--version <version>', 'Version'))
  .addOption(new Option('--dry-run <dry-run>', 'Dry run'))
  .addOption(new Option('--output <output>', 'Output').default(Output.DETAILED).choices(Object.values(Output)))
  .addOption(new Option('--output-format <output-format>', 'Output format').default(OutputFormats.TEXT).choices(Object.values(OutputFormats)))
  .showSuggestionAfterError()

const collect = command.command('collect').description('A good description for Collect command')
collect
  .command('all')
  .description('A good description for Collect All command')
  .option('-f, --filter <type>', 'Filter')

const clean = command.command('clean').description('A good description for Clean command')
clean
  .command('all')
  .description('A good description for Clean All command')
  .option('-f, --filter <type>', 'Filter')

const cloudChiprCli = CloudChiprCliProvider.getProvider(command.opts().cloudProvider)
cloudChiprCli
  .customiseCommand(command)
  .customiseCollectCommand(collect)
  .customiseCleanCommand(clean)

try {
  command.parse(process.argv)
} catch (e) {
  console.error(chalk.red(chalk.underline('Error:'), e.message))
}

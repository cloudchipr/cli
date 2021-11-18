#!/usr/bin/env node

import chalk from 'chalk'
import { Command, Option } from 'commander'
import { CloudProvider, Output, OutputFormats } from './constants'
import CloudChiprCliProvider from './cli/cloud-chipr-cli-provider'
require('dotenv').config()

const command = new Command()
command
  .description('Cloudchipr-cli (c8r) is a command line tool to help users collect, identify, filter and clean cloud resources in order to reduce resource waste and optimize cloud cost.')
  .addOption(new Option('--cloud-provider <cloud-provider>', 'Cloud provider').default(CloudProvider.AWS).choices(Object.values(CloudProvider)))
  .addOption(new Option('--verbose <verbose>', 'Verbose').default(0))
  .addOption(new Option('--version <version>', 'Version'))
  .addOption(new Option('--dry-run <dry-run>', 'Dry run'))
  .addOption(new Option('--output <output>', 'Output').default(Output.DETAILED).choices(Object.values(Output)))
  .addOption(new Option('--output-format <output-format>', 'Output format').default(OutputFormats.TABLE).choices(Object.values(OutputFormats)))
  .showSuggestionAfterError()

const collect = command
  .command('collect')
  .description('Connects to the users\' cloud account(s) and collects resource information including a big variety of attributes and metadata about a given resource.\nThis data is meant to be filtered based on different criteria focused around identifying usage and reducing cloud cost by eliminating unused resources.')
collect
  .command('all')
  .description('Collect app resources based on the specified filters')
  .option('-f, --filter <type>', 'Filter')

const clean = command
  .command('clean')
  .description('Connects to the user\'s cloud account(s) and permanently terminates resources identified by the user\'s configuration of filters.\nIt\'s best used as a follow up to `collect` command, which allows users to identify costly unused resources.')
clean
  .command('all')
  .description('Terminate all resources from a cloud provider')
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

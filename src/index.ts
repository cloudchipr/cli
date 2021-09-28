#!/usr/bin/env node

require('dotenv').config();
import {Command, Option} from 'commander';
import {CloudProvider, Output, OutputFormats, Profile, Region} from "./constants";
import DecoratorProvider from "./decortaor/decortaor-providert";
import chalk from 'chalk';

const command = new Command();
command
  .addOption(new Option('--cloud-provider <cloud-provider>', 'Cloud provider').default(CloudProvider.AWS).choices(Object.values(CloudProvider)))
  .addOption(new Option('--region <region>', 'Region').default(Region.US_EAST_1))
  .addOption(new Option('--verbose <verbose>', 'Verbose').default(0))
  .addOption(new Option('--version <version>', 'Version'))
  .addOption(new Option('--dry-run <dry-run>', 'Dry run'))
  .addOption(new Option('--help <help>', 'Help'))
  .addOption(new Option('--output <output>', 'Output').default(Output.DETAILED).choices(Object.values(Output)))
  .addOption(new Option('--output-format <output-format>', 'Output format').default(OutputFormats.TEXT).choices(Object.values(OutputFormats)));

const decoratorProvider = (new DecoratorProvider()).getProvider(command.opts().cloudProvider);
decoratorProvider.decorateCommand(command);

const collect = command.command('collect');
collect
  .command('all')
  .option('-f, --filter <type>', 'Filter')
  .action((options) => {
  });

decoratorProvider.decorateCollectCommand(collect);
//add here clean and nuke decorators

try {
    command.parse(process.argv);
} catch (e) {
    console.error(chalk.red(chalk.underline('Error:'), e.message));
}

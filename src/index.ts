#!/usr/bin/env node

import { Command, Option } from 'commander';
import { OutputService } from './services/output/output-service';

const program = new Command();

const collect = program
  .addOption(new Option('--cloud-provider <cloud-provider>', 'Cloud provider').default('aws'))
  .addOption(new Option('--region <region>', 'Region').default('us-east-1'))
  .addOption(new Option('--account-id <account-id>', 'Account id'))
  .addOption(new Option('--verbose <verbose>', 'Verbose').default(0))
  .addOption(new Option('--profile <profile>', 'Profile'))
  .addOption(new Option('--version <version>', 'Version'))
  .addOption(new Option('--dry-run <dry-run>', 'Dry run'))
  .addOption(new Option('--help <help>', 'Help'))
  .addOption(new Option('--output <output>', 'Output').default('detailed').choices(['summarized', 'detailed']))
  .addOption(new Option('--output-format <output-format>', 'Output format').default('text').choices(['json', 'text', 'table', 'yaml']))
  .command('collect');

collect
  .command('all')
  .option('-f, --filter <type>', 'Filter')
  .action((options) => {
    // console.log('collect all');
    // console.log(program.opts().region);
    // console.log(program.opts().output);
    // console.log(program.opts().outputFormat);
    // console.log(options.filter);
    const output = new OutputService();
    output.print(program.opts().region, program.opts().outputFormat);
    // console.log(program.opts().outputFormat);
  });
collect
  .command('ec2')
  .option('-f, --filter <type>', 'Filter')
  .action((options) => {
    console.log('collect ec2');
  });

program.parse(process.argv);

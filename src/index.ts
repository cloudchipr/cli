#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

const collect = program
  .option('--cloud-provider <type>', 'Cloud provider', 'aws')
  .option('--region <type>', 'Region', 'us-east-1')
  .option('--account-id <type>', 'Account id')
  .option('--verbose <type>', 'Verbose', '0')
  .option('--profile <type>', 'Profile')
  .option('--version <type>', 'Version')
  .option('--dry-run <type>', 'Dry run')
  .option('--help <type>', 'Help')
  .option('--output <type>', 'Output')
  .option('--output-format <type>', 'Output format')
  .command('collect');

collect
  .command('all')
  .option('-f, --filter <type>', 'Filter')
  .action((options) => {
    console.log('collect all');
    console.log(program.opts().cloudProvider);
    console.log(program.opts().verbose);
    console.log(program.opts().region);
    console.log(options.filter);
  });
collect
  .command('ec2')
  .option('-f, --filter <type>', 'Filter')
  .action((options) => {
    console.log('collect ec2');
  });

program.parse(process.argv);

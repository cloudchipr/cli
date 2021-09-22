#!/usr/bin/env node

import { Command, Option } from 'commander';
import AwsCliManager from "./aws/aws-cli-manager";
import { OutputService } from './services/output/output-service';
import {CloudProvider, Output, OutputFormats, Profile, Region} from "./constants";

const program = new Command();

const collect = program
  .addOption(new Option('--cloud-provider <cloud-provider>', 'Cloud provider').default(CloudProvider.AWS))
  .addOption(new Option('--region <region>', 'Region').default(Region.US_EAST_1))
  .addOption(new Option('--account-id <account-id>', 'Account id'))
  .addOption(new Option('--verbose <verbose>', 'Verbose').default(0))
  .addOption(new Option('--profile <profile>', 'Profile').default(Profile.DEFAULT))
  .addOption(new Option('--version <version>', 'Version'))
  .addOption(new Option('--dry-run <dry-run>', 'Dry run'))
  .addOption(new Option('--help <help>', 'Help'))
  .addOption(new Option('--output <output>', 'Output').default(Output.DETAILED).choices(Object.values(Output)))
  .addOption(new Option('--output-format <output-format>', 'Output format').default(OutputFormats.TEXT).choices(Object.values(OutputFormats)))
  .command('collect');

collect
  .command('all')
  .option('-f, --filter <type>', 'Filter')
  .action((options) => {
    if (program.opts().cloudProvider === 'aws') {
        const awsCliManager = new AwsCliManager()
        try {
            const awsCredential = awsCliManager.getCredentials(
                program.opts().profile,
                program.opts().region,
                program.opts().accountId,
            )
            console.log(awsCredential);
        } catch (e) {
            console.error('error: Cannot find AWS credentials with ' + program.opts().profile + ' profile');
        }
    }
      const output = new OutputService();
      output.print(program.opts().region, program.opts().outputFormat);
  });
collect
  .command('ec2')
  .option('-f, --filter <type>', 'Filter')
  .action((options) => {
    console.log('collect ec2');
  });

program.parse(process.argv);

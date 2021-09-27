#!/usr/bin/env node

require('dotenv').config();
import {Command, Option, OptionValues} from 'commander';
import CredentialProvider from "./credential-provider";
import {FilterProvider} from "./filter-provider";
import EngineRequestBuilder from "./engine-request-builder";
import {Command as CloudChiprCommand} from "cloudchipr-engine/lib/Command";
import {AwsSubCommand} from "cloudchipr-engine/lib/aws-sub-command";
import {AWSShellEngineAdapter} from "cloudchipr-engine/lib/adapters/aws-shell-engine-adapter";
import { OutputService } from './services/output/output-service';
import {CloudProvider, Output, OutputFormats, Profile, Region} from "./constants";
import chalk from 'chalk';

const program = new Command();
const credentialProvider = new CredentialProvider()
const filterProvider = new FilterProvider()

const collect = program
  .addOption(new Option('--cloud-provider <cloud-provider>', 'Cloud provider').default(CloudProvider.AWS).choices(['aws']))
  .addOption(new Option('--region <region>', 'Region').default('us-east-1'))
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
  });

collect
    .command('ebs')
    .option('-f, --filter <type>', 'Filter')
    .action((options) => {

        options = Object.assign(program.opts(), options) as OptionValues;
        let er = EngineRequestBuilder
            .builder()
            .setOptions(options)
            .setCommand(CloudChiprCommand.collect())
            .setSubCommand(AwsSubCommand.ebs())
            .build();

        let engineAdapter = new AWSShellEngineAdapter(process.env.C8R_CUSTODIAN as string)
        engineAdapter.execute(er)
        console.log(er)
    });

collect
  .command('ec2')
  .option('-f, --filter <type>', 'Filter')
  .action((options) => {
    console.log('collect ec2');
  });

try {
    program.parse(process.argv);
} catch (e) {
    console.error(chalk.red(chalk.underline('Error:'), e.message));
}

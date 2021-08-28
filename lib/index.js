#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var program = new commander_1.Command();
var collect = program
    .addOption(new commander_1.Option('--cloud-provider <cloud-provider>', 'Cloud provider').default('aws'))
    .addOption(new commander_1.Option('--region <region>', 'Region').default('us-east-1'))
    .addOption(new commander_1.Option('--account-id <account-id>', 'Account id'))
    .addOption(new commander_1.Option('--verbose <verbose>', 'Verbose').default(0))
    .addOption(new commander_1.Option('--profile <profile>', 'Profile'))
    .addOption(new commander_1.Option('--version <version>', 'Version'))
    .addOption(new commander_1.Option('--dry-run <dry-run>', 'Dry run'))
    .addOption(new commander_1.Option('--help <help>', 'Help'))
    .addOption(new commander_1.Option('--output <output>', 'Output').default('detailed').choices(['summarized', 'detailed']))
    .addOption(new commander_1.Option('--output-format <output-format>', 'Output format').default('text').choices(['json', 'text', 'table', 'yaml']))
    .command('collect');
collect
    .command('all')
    .option('-f, --filter <type>', 'Filter')
    .action(function (options) {
    console.log('collect all');
    console.log(program.opts().region);
    console.log(program.opts().output);
    console.log(program.opts().outputFormat);
    console.log(options.filter);
});
collect
    .command('ec2')
    .option('-f, --filter <type>', 'Filter')
    .action(function (options) {
    console.log('collect ec2');
});
program.parse(process.argv);

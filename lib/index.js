#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var aws_cli_manager_1 = __importDefault(require("./aws/aws-cli-manager"));
var program = new commander_1.Command();
function errorColor(str) {
    // Add ANSI escape codes to display text in red.
    return "\u001B[31m" + str + "\u001B[0m";
}
program
    .configureOutput({
    // Visibly override write routines as example!
    writeOut: function (str) { return process.stdout.write("[OUT] " + str); },
    writeErr: function (str) { return process.stdout.write("[ERR] " + str); },
    // Output errors in red.
    outputError: function (str, write) { return write(errorColor(str)); }
});
program.showHelpAfterError();
var collect = program
    .addOption(new commander_1.Option('--cloud-provider <cloud-provider>', 'Cloud provider').default('aws'))
    .addOption(new commander_1.Option('--region <region>', 'Region').default('us-east-1'))
    .addOption(new commander_1.Option('--account-id <account-id>', 'Account id'))
    .addOption(new commander_1.Option('--verbose <verbose>', 'Verbose').default(0))
    .addOption(new commander_1.Option('--profile <profile>', 'Profile').default('default'))
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
    if (program.opts().cloudProvider === 'aws') {
        const awsCliManager = new aws_cli_manager_1.default();
        try {
            const awsCredential = awsCliManager.getCredentials(program.opts().profile, program.opts().region, program.opts().accountId);
            console.log(awsCredential);
        } catch (e) {
            console.error('error: Cannot find AWS credentials with ' + program.opts().profile + ' profile');
        }
    }
});
collect
    .command('ec2')
    .option('-f, --filter <type>', 'Filter')
    .action(function (options) {
    console.log('collect ec2');
});
program.parse(process.argv);

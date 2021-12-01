#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var chalk_1 = require("chalk");
var commander_1 = require("commander");
var constants_1 = require("./constants");
var cloud_chipr_cli_provider_1 = require("./cli/cloud-chipr-cli-provider");
require('dotenv').config();
var command = new commander_1.Command();
command
    .description('Cloudchipr-cli (c8r) is a command line tool to help users collect, identify, filter and clean cloud resources in order to reduce resource waste and optimize cloud cost.')
    .addOption(new commander_1.Option('--cloud-provider <cloud-provider>', 'Cloud provider')["default"](constants_1.CloudProvider.AWS).choices(Object.values(constants_1.CloudProvider)))
    .addOption(new commander_1.Option('--verbose <verbose>', 'Verbose')["default"](constants_1.Verbose.DISABLED).choices(Object.values(constants_1.Verbose)))
    .addOption(new commander_1.Option('--version <version>', 'Version'))
    .addOption(new commander_1.Option('--dry-run <dry-run>', 'Dry run'))
    .addOption(new commander_1.Option('--output <output>', 'Output')["default"](null).choices(Object.values(constants_1.Output)))
    .addOption(new commander_1.Option('--output-format <output-format>', 'Output format')["default"](constants_1.OutputFormats.TABLE).choices(Object.values(constants_1.OutputFormats)))
    .showSuggestionAfterError();
var collect = command
    .command('collect')
    .description('Connects to the users\' cloud account(s) and collects resource information including a big variety of attributes and metadata about a given resource.\nThis data is meant to be filtered based on different criteria focused around identifying usage and reducing cloud cost by eliminating unused resources.');
var clean = command
    .command('clean')
    .description('Connects to the user\'s cloud account(s) and permanently terminates resources identified by the user\'s configuration of filters.\nIt\'s best used as a follow up to `collect` command, which allows users to identify costly unused resources.');
clean
    .command('all')
    .description('Terminate all resources from a cloud provider')
    .option('-f, --filter <type>', 'Filter');
var cloudChiprCli = cloud_chipr_cli_provider_1["default"].getProvider(command.opts().cloudProvider);
cloudChiprCli
    .customiseCommand(command)
    .customiseCollectCommand(collect)
    .customiseCleanCommand(clean);
try {
    command.parseAsync(process.argv)["catch"](function (e) {
        console.error(chalk_1["default"].red(chalk_1["default"].underline('Error:'), e.message));
    });
}
catch (e) {
    console.error(chalk_1["default"].red(chalk_1["default"].underline('Error:'), e.message));
}

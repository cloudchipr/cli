#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var program = new commander_1.Command();
var collect = program
    // .enablePositionalOptions()
    .option('-c, --cloud-provider <type>', 'Cloud provider', 'aws')
    .option('-r, --region <type>', 'Region', 'us-east-1')
    .option('-a, --account-id <type>', 'Account id')
    .option('-v, --verbose <type>', 'Verbose', '0')
    .option('-p, --profile <type>', 'Profile')
    .command('collect');
collect
    .command('all')
    .option('-f, --filter <type>', 'Filter')
    .action(function (options) {
    console.log('collect all');
    console.log(program.opts().cloudProvider);
    console.log(program.opts().verbose);
    console.log(program.opts().region);
    console.log(options.filter);
});
collect
    .command('ec2')
    .option('-f, --filter <type>', 'Filter')
    .action(function (options) {
    console.log('collect ec2');
});
program.parse(process.argv);

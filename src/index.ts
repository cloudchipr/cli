#!/usr/bin/env node

import chalk from 'chalk'
import { Command, Option } from 'commander'
import {
  CloudProvider,
  Output,
  OutputDirectory,
  OutputFormats
} from './constants'
import CloudChiprCliProvider from './cli/cloud-chipr-cli-provider'
import { LoggerHelper, OutputHelper } from './helpers'
import moment from 'moment'
import fs from 'fs'
import ini from 'ini'
require('dotenv').config({ path: `${__dirname}/../.env` })

const configPath = './.c8r/c8r_config'
let configs: {[k: string]: any} = {}
try {
  fs.accessSync('./.c8r')
} catch (e) {
  fs.mkdirSync('./.c8r')
}
try {
  configs = ini.decode(fs.readFileSync(configPath, 'utf-8'))
} catch (e) {}

const command = new Command()
command.name('c8r')

command
  .description('Configure')
  .command('configure')
  .addOption(new Option('--set-default-provider <default-provider>', 'Set default cloud provider').choices(Object.values(CloudProvider)).conflicts('list'))
  .addOption(new Option('--list', 'List default configs'))
  .action((options) => {
    if (options.list) {
      for (const config in configs) {
        console.log(`[${config}]`)
        for (const c in configs[config]) {
          console.log(`${c} = ${configs[config][c]}`)
        }
      }
    } else if (options.setDefaultProvider) {
      if (!('default' in configs)) {
        configs.default = {}
      }
      configs.default.cloud_provider = options.setDefaultProvider
      fs.writeFileSync(configPath, ini.encode(configs))
    }
  })
  .showSuggestionAfterError()

command
  .description('Cloudchipr-cli (c8r) is a command line tool to help users collect, identify, filter and clean cloud resources in order to reduce resource waste and optimize cloud cost.')
  .addOption(new Option('--cloud-provider <cloud-provider>', 'Cloud provider').default(CloudProvider.AWS).choices(Object.values(CloudProvider)))
  .addOption(new Option('--verbose', 'Verbose'))
  .addOption(new Option('--version <version>', 'Version'))
  .addOption(new Option('--output <output>', 'Output').default(null).choices(Object.values(Output)))
  .addOption(new Option('--output-format <output-format>', 'Output format').default(OutputFormats.TABLE).choices(Object.values(OutputFormats)))
  .showSuggestionAfterError()

const collect = command
  .command('collect')
  .description('Connects to the user\'s cloud account(s) and collects resource information including a big variety of attributes and metadata about a given resource.\nThis data is meant to be filtered based on different criteria focused around identifying usage and reducing cloud cost by eliminating unused resources.')

const clean = command
  .command('clean')
  .description('Connects to the user\'s cloud account(s) and permanently terminates resources identified by the user\'s configuration of filters.\nIt\'s best used as a follow up to `collect` command, which allows users to identify costly unused resources.')

const logFilename = `${OutputDirectory}/logs/${moment().format('YYYY-MM-DD')}.log`
try {
  let cloudProvider: string
  process.argv.forEach((val, index) => {
    if (val === '--cloud-provider') {
      cloudProvider = process.argv[index + 1]
    }
  })
  CloudChiprCliProvider.getProvider(cloudProvider ?? configs.default?.cloud_provider ?? command.opts().cloudProvider)
    .customiseCommand(command)
    .customiseCollectCommand(collect)
    .customiseCleanCommand(clean)

  command.parseAsync(process.argv).catch(e => {
    LoggerHelper.logFile(logFilename, e.message, e)
    if (command.getOptionValue('verbose') === true) {
      OutputHelper.text(`Error: Failed on executing command due to: ${e.message}. \nThe trace log can be found in ${logFilename} directory.`, 'failure')
      OutputHelper.text(chalk.red(e.stack))
    } else {
      OutputHelper.text('Error: Failed on executing command, please run c8r with --verbose flag and follow the trace log.', 'failure')
    }
  })
} catch (e) {
  LoggerHelper.logFile(logFilename, e.message, e)
  OutputHelper.text(`Error: Failed on executing command due to: ${e.message}. \nThe trace log can be found in ${logFilename} directory.`, 'failure')
}

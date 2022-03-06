import chalk from 'chalk'
import { readFileSync } from 'fs'

export class FilterHelper {
  static getDefaultFilterPath (provider: string, subcommand: string): string {
    return `${__dirname}/../../default-filters/${provider}/${subcommand}.yaml`
  }

  static getDefaultFilter (provider: string, subcommand: string): string {
    return readFileSync(FilterHelper.getDefaultFilterPath(provider, subcommand), 'utf8')
  }

  static getFilterExample (provider: string, subcommand: string): string {
    return `\n${chalk.yellow('Filter example (filter.yaml)')}:\n${FilterHelper.getDefaultFilter(provider, subcommand)}`
  }
}

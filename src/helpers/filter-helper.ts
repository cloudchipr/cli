import chalk from 'chalk'
import { readFileSync } from 'fs'

export class FilterHelper {
  static getDefaultFilterPath (subcommand: string): string {
    return `${__dirname}/../../default-filters/${subcommand}.yaml`
  }

  static getDefaultFilter (subcommand: string): string {
    return readFileSync(FilterHelper.getDefaultFilterPath(subcommand), 'utf8')
  }

  static getFilterExample (subcommand: string): string {
    return `\n${chalk.yellow('Filter example (filter.yaml)')}:\n${FilterHelper.getDefaultFilter(subcommand)}`
  }
}

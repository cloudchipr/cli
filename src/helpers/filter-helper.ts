import { readFileSync } from 'fs'

export class FilterHelper {
  static getDefaultFilter (subcommand: string): string {
    return readFileSync(`./default-filters/${subcommand}.yaml`, 'utf8')
  }
}

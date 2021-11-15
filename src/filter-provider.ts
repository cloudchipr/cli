import { readFileSync } from 'fs'
import yaml from 'yaml'
import { FilterBuilder, FilterInterface } from '@cloudchipr/cloudchipr-engine'
import { OptionValues } from 'commander'

export class FilterProvider {
  getFilter (options: OptionValues): FilterInterface {
    const builder = new FilterBuilder()
    return builder
      .load(yaml.parse(readFileSync(options.filter, 'utf8')))
      .toList()
  }
}

import { readFileSync } from 'fs'
import yaml from 'yaml'
import { FilterBuilder, FilterInterface, SubCommandInterface, FilterValidator } from '@cloudchipr/cloudchipr-engine'
import { OptionValues } from 'commander'

export class FilterProvider {
  getFilter (options: OptionValues, subCommand: SubCommandInterface): FilterInterface {
    const builder = new FilterBuilder(new FilterValidator(subCommand))
    return builder
      .load(yaml.parse(readFileSync(options.filter, 'utf8')))
      .toList()
  }
}

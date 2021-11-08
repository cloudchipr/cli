import { readFileSync } from 'fs'
import yaml from 'yaml'
import { AwsSubCommand, FilterBuilder, FilterInterface, SubCommandInterface } from '@cloudchipr/cloudchipr-engine'
import { OptionValues } from 'commander'

export class FilterProvider {
  getFilter (options: OptionValues, subCommand: SubCommandInterface): FilterInterface {
    const builder = new FilterBuilder()
    let filter

    if (options.filter) {
      filter = builder
        .load(yaml.parse(readFileSync(options.filter, 'utf8')))
        .toList()
    } else {
      switch (subCommand.getValue()) {
        case AwsSubCommand.EC2_SUBCOMMAND:
          filter = FilterProvider.getEc2DefaultFilter()
      }
    }

    return filter
  }

  private static getEc2DefaultFilter (): FilterInterface {
    const builder = new FilterBuilder()

    return builder
      .resource('launch-time')
      .greaterThanOrEqualTo('0')
      .and()
      .resource('cpu')
      .lessThanOrEqualTo('100', '1')
      .and()
      .resource('network-in')
      .lessThanOrEqualTo('100000000000', '1')
      .and()
      .resource('network-out')
      .lessThanOrEqualTo('100000000000', '1')
      .toList()
  }
}

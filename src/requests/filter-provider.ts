import { readFileSync } from 'fs'
import yaml from 'yaml'
import { FilterBuilder, FilterInterface, SubCommandInterface, FilterValidator } from '@cloudchipr/cloudchipr-engine'
import { OptionValues } from 'commander'
import {SubCommands} from '../constants'

export class FilterProvider {
  static getCollectFilter (options: OptionValues, subCommand: SubCommandInterface): FilterInterface {
    const builder = new FilterBuilder(new FilterValidator(subCommand))
    return builder
      .load(yaml.parse(readFileSync(options.filter, 'utf8')))
      .toList()
  }

  static getCleanFilter (ids: string[], subCommand: SubCommandInterface): FilterInterface {
    const builder = new FilterBuilder(new FilterValidator(subCommand))
    let resource: string
    switch (subCommand.getValue()) {
      case SubCommands.EBS:
        resource = 'volume-id'
        break
      case SubCommands.EC2:
        resource = 'instance-id'
        break
      // case SubCommands.EIP:
      //   resource = 'public-ip'
      //   break
      default:
        throw new Error(`Invalid subcommand [${subCommand.getValue()}] provided for clean command.`)
    }
    ids.forEach((id) => builder.or().resource(resource).equal(id))
    return builder.toList()
  }
}

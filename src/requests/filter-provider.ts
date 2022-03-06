import { readFileSync } from 'fs'
import yaml from 'yaml'
import { FilterBuilder, FilterInterface, SubCommandInterface, FilterValidator } from '@cloudchipr/cloudchipr-engine'
import { OptionValues } from 'commander'
import { AwsSubCommands } from '../constants'

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
      case AwsSubCommands.EBS:
        resource = 'volume-id'
        break
      case AwsSubCommands.EC2:
        resource = 'instance-id'
        break
      case AwsSubCommands.RDS:
        resource = 'db-instance-identifier'
        break
      case AwsSubCommands.EIP:
        resource = 'public-ip'
        break
      case AwsSubCommands.ELB:
      case AwsSubCommands.NLB:
      case AwsSubCommands.ALB:
        resource = 'load-balancer-name'
        break
      default:
        throw new Error(`Invalid subcommand [${subCommand.getValue()}] provided for clean command.`)
    }
    ids.forEach((id) => builder.or().resource(resource).equal(id))
    return builder.toList()
  }
}

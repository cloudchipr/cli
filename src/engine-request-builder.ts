import {
  EngineRequest,
  Command,
  SubCommandInterface,
  Parameter
} from '@cloudchipr/cloudchipr-engine'
import { OptionValues } from 'commander'
import { FilterProvider } from './filter-provider'
import { Verbose } from './constants'

export default class EngineRequestBuilder {
    private options: OptionValues;
    private command: Command;
    private subCommand: SubCommandInterface;

    // Only enabled Regions
    private static allRegions: Set<string> = new Set([
      'us-east-2',
      'us-east-1',
      'us-west-1',
      'us-west-2',
      'ca-central-1',
      'eu-central-1',
      'eu-west-1',
      'eu-west-2',
      'eu-west-3',
      'sa-east-1',
    ])

    setOptions (options: OptionValues): EngineRequestBuilder {
      this.options = options
      return this
    }

    setCommand (command: Command): EngineRequestBuilder {
      this.command = command
      return this
    }

    setSubCommand (subCommand: SubCommandInterface): EngineRequestBuilder {
      this.subCommand = subCommand
      return this
    }

    build (): EngineRequest {
      return new EngineRequest(
        this.command,
        this.subCommand,
        this.buildParameter(this.options),
        this.options.verbose === Verbose.ENABLED
      )
    }

    public static builder (): EngineRequestBuilder {
      return new EngineRequestBuilder()
    }

    private buildParameter (options: OptionValues): Parameter {
      const filterProvider = new FilterProvider()
      const filter = filterProvider.getFilter(options, this.subCommand)

      let regions : Set<string> = new Set(options.region)
      if (regions.has('all')) {
        regions = EngineRequestBuilder.allRegions
      }

      return new Parameter(filter, false, Array.from( regions ))
    }
}

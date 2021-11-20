import {
  EngineRequest,
  Command,
  SubCommandInterface,
  Parameter
} from '@cloudchipr/cloudchipr-engine'
import { OptionValues } from 'commander'
import { FilterProvider } from './filter-provider'

export default class EngineRequestBuilder {
    private options: OptionValues;
    private command: Command;
    private subCommand: SubCommandInterface;

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
        EngineRequestBuilder.buildParameter(this.options),
        this.options.verbose === "1"
      )
    }

    public static builder (): EngineRequestBuilder {
      return new EngineRequestBuilder()
    }

    private static buildParameter (options: OptionValues): Parameter {
      const filterProvider = new FilterProvider()
      const filter = filterProvider.getFilter(options)

      return new Parameter(filter, false, options.region as string[])
    }
}

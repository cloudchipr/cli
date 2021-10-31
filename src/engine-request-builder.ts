import {
  EngineRequest,
  Command,
  SubCommandInterface,
  Parameter,
  Configuration
} from '@cloudchipr/cloudchipr-engine'
import { OptionValues } from 'commander'
import CredentialProvider from './credential-provider'
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
        EngineRequestBuilder.buildConfiguration(this.options),
        this.command,
        this.subCommand,
        EngineRequestBuilder.buildParameter(this.options, this.subCommand)
      )
    }

    public static builder (): EngineRequestBuilder {
      return new EngineRequestBuilder()
    }

    private static buildConfiguration (options: OptionValues): Configuration {
      const credentialProvider = new CredentialProvider()
      const credentials = credentialProvider.getCredentials(options.cloudProvider, options)

      return new Configuration(credentials.getAccessKey(), credentials.getSecretKey(), options.region)
    }

    private static buildParameter (options: OptionValues, subCommand: SubCommandInterface): Parameter {
      const filterProvider = new FilterProvider()
      const filter = filterProvider.getFilter(options, subCommand)

      return new Parameter(filter, false)
    }
}

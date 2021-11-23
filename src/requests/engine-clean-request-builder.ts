import {
  Command,
  EngineRequest,
  Parameter
} from '@cloudchipr/cloudchipr-engine'
import { FilterProvider } from './filter-provider'
import EngineRequestBuilder from './engine-request-builder'

export default class EngineCleanRequestBuilder extends EngineRequestBuilder {
  private options: string[];

  constructor (command: Command) {
    super(command)
  }

  setOptions (options: string[]): EngineRequestBuilder {
    this.options = options
    return this
  }

  build (ids: string[] = []): EngineRequest {
    return new EngineRequest(
      this.command,
      this.subCommand,
      this.buildParameter(this.options),
      false
    )
  }

  private buildParameter (options: string[]): Parameter {
    const filter = FilterProvider.getCleanFilter(options, this.subCommand)
    return new Parameter(filter, false, [])
  }
}

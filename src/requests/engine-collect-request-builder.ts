import {
  Command,
  EngineRequest,
  Parameter
} from '@cloudchipr/cloudchipr-engine'
import { OptionValues } from 'commander'
import { FilterProvider } from './filter-provider'
import { AllRegions, Verbose } from '../constants'
import EngineRequestBuilder from './engine-request-builder'

export default class EngineCollectRequestBuilder extends EngineRequestBuilder {
  private options: OptionValues

  constructor (command: Command) {
    super(command)
  }

  setOptions (options: OptionValues): EngineRequestBuilder {
    this.options = options
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

  private buildParameter (options: OptionValues, ids: string[] = []): Parameter {
    const filter = FilterProvider.getCollectFilter(options, this.subCommand)
    let regions : Set<string> = new Set(options.region)
    if (regions.has('all')) {
      regions = AllRegions
      regions = AllRegions
    }
    return new Parameter(filter, false, Array.from(regions), [])
  }
}

import {
  Command,
  EngineRequest,
  Parameter
} from '@cloudchipr/cloudchipr-engine'
import { FilterProvider } from './filter-provider'
import EngineRequestBuilder from './engine-request-builder'
import { AllRegions } from '../constants'
import { OptionValues } from 'commander'

export default class EngineCleanRequestBuilder extends EngineRequestBuilder {

  constructor (command: Command) {
    super(command)
  }

  build (): EngineRequest {
    return new EngineRequest(
      this.command,
      this.subCommand,
      this.buildParameter(this.options),
      false
    )
  }

  private buildParameter (options: OptionValues): Parameter {
    const filter = FilterProvider.getCleanFilter(options.ids, this.subCommand)
    let regions : Set<string> = new Set(options.region)
    if (regions.has('all')) {
      regions = AllRegions
      regions = AllRegions
    }
    
    const accounts : Set<string> = new Set(options.accountId)
    return new Parameter(filter, false, Array.from(regions), Array.from(accounts))
  }
}

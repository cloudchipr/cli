import {
  Command,
  EngineRequest, FilterInterface,
  Parameter
} from '@cloudchipr/cloudchipr-engine'
import { OptionValues } from 'commander'
import { FilterProvider } from './filter-provider'
import { AllRegions, Verbose } from '../constants'
import EngineRequestBuilder from './engine-request-builder'

export default class EngineCollectRequestBuilder extends EngineRequestBuilder {
  constructor (command: Command) {
    super(command)
  }

  // build (): EngineRequest {
  //   return new EngineRequest(
  //     this.command,
  //     this.subCommand,
  //     this.buildParameter(this.options, this.getFilter()),
  //     this.options.verbose === Verbose.ENABLED
  //   )
  // }

  getFilter (): FilterInterface {
    return FilterProvider.getCollectFilter(this.options, this.subCommand)
  }
}

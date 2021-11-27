import {
  Command,
  EngineRequest, FilterInterface,
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

  // build (): EngineRequest {
  //   return new EngineRequest(
  //     this.command,
  //     this.subCommand,
  //     this.buildParameter(this.options, this.getFilter()),
  //     false
  //   )
  // }

  getFilter (): FilterInterface {
    return FilterProvider.getCleanFilter(this.ids, this.subCommand)
  }
}

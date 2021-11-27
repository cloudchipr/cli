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

  getFilter (): FilterInterface {
    return FilterProvider.getCollectFilter(this.options, this.subCommand)
  }
}

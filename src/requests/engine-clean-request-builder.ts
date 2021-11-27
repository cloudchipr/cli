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

  getFilter (): FilterInterface {
    return FilterProvider.getCleanFilter(this.ids, this.subCommand)
  }
}

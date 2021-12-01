import {
  Command,
  FilterInterface
} from '@cloudchipr/cloudchipr-engine'
import { FilterProvider } from './filter-provider'
import EngineRequestBuilder from './engine-request-builder'

export default class EngineCleanRequestBuilder extends EngineRequestBuilder {
  constructor (command: Command) {
    super(command)
  }

  getFilter (): FilterInterface {
    return FilterProvider.getCleanFilter(this.ids, this.subCommand)
  }
}

import { Command } from '@cloudchipr/cloudchipr-engine'
import EngineRequestBuilder from './engine-request-builder'
import EngineCollectRequestBuilder from './engine-collect-request-builder'
import EngineCleanRequestBuilder from './engine-clean-request-builder'

export default class EngineRequestBuilderFactory {
  static getInstance (command: Command): EngineRequestBuilder {
    switch (command.getValue()) {
      case 'collect':
        return new EngineCollectRequestBuilder(command)
      case 'clean':
        return new EngineCleanRequestBuilder(command)
      default:
        throw new Error(`Invalid command [${command.getValue()}] provided.`)
    }
  }
}

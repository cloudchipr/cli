import {
  Command,
  EngineRequest,
  SubCommandInterface
} from '@cloudchipr/cloudchipr-engine'
import {OptionValues} from "commander";

export default abstract class EngineRequestBuilder {
  protected command: Command
  protected subCommand: SubCommandInterface

  protected constructor (command: Command) {
    this.setCommand(command)
  }

  abstract setOptions (options: OptionValues | string[]): EngineRequestBuilder

  setCommand (command: Command): EngineRequestBuilder {
    this.command = command
    return this
  }

  setSubCommand (subCommand: SubCommandInterface): EngineRequestBuilder {
    this.subCommand = subCommand
    return this
  }

  abstract build (): EngineRequest
}
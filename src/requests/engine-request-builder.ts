import {
  Command,
  EngineRequest, FilterInterface, Parameter,
  SubCommandInterface
} from '@cloudchipr/cloudchipr-engine'
import { OptionValues } from 'commander'
import { AllRegions, Verbose } from '../constants'

export default abstract class EngineRequestBuilder {
  protected command: Command
  protected subCommand: SubCommandInterface
  protected options: OptionValues
  protected ids: string[]

  protected constructor (command: Command) {
    this.setCommand(command)
  }

  setOptions (options: OptionValues): EngineRequestBuilder {
    this.options = options
    return this
  }

  setCommand (command: Command): EngineRequestBuilder {
    this.command = command
    return this
  }

  setSubCommand (subCommand: SubCommandInterface): EngineRequestBuilder {
    this.subCommand = subCommand
    return this
  }

  setIds (ids: string[]): EngineRequestBuilder {
    this.ids = ids
    return this
  }

  build (): EngineRequest {
    return new EngineRequest(
      this.command,
      this.subCommand,
      this.buildParameter(this.options, this.getFilter()),
      this.options.verbose === Verbose.ENABLED
    )
  }

  protected buildParameter (options: OptionValues, filter: FilterInterface): Parameter {
    let regions : Set<string> = new Set(options.region)
    if (regions.has('all')) {
      regions = AllRegions
      regions = AllRegions
    }
    const accounts : Set<string> = new Set(options.accountId)
    return new Parameter(filter, false, Array.from(regions), Array.from(accounts))
  }

  abstract getFilter (): FilterInterface
}

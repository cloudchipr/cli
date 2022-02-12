import {
  Command,
  EngineRequest, FilterInterface, Parameter,
  SubCommandInterface
} from '@cloudchipr/cloudchipr-engine'
import { OptionValues } from 'commander'
import { OutputDirectory } from '../constants'
import moment from 'moment'
import { v4 } from 'uuid'

export default abstract class EngineRequestBuilder {
  public static outputDirectory: string = `${OutputDirectory}/run/${moment().format('YYYY-MM-DD_HH-mm-ss')}_${v4()}`
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
      this.options.verbose === true,
      EngineRequestBuilder.outputDirectory
    )
  }

  protected buildParameter (options: OptionValues, filter: FilterInterface): Parameter {
    const accounts : Set<string> = new Set(options.accountId)
    return new Parameter(filter, false, Array.from(new Set(options.region)), Array.from(accounts))
  }

  abstract getFilter (): FilterInterface
}

import ResponseDecorator from './response-decorator'
import { ProviderResource, Response } from '@cloudchipr/cloudchipr-engine'
import { COLORS, Output, OutputDirectory } from '../constants'
import { LoggerHelper, OutputHelper } from '../helpers'
import chalk from 'chalk'
import { ResponsePrintInterface } from './response-interface'
import moment from 'moment'

export default class ResponsePrint {
  private responseDecorator: ResponseDecorator

  constructor () {
    this.responseDecorator = new ResponseDecorator()
  }

  printCollectResponse (
    responses: Response<ProviderResource>[],
    cloudProvider: string,
    subCommand: string | null = null,
    option: ResponsePrintInterface
  ): void {
    let found = false
    let summaryData = []
    responses.forEach((response) => {
      if (response.count === 0) {
        return
      }
      found = true
      if (option.output === Output.DETAILED || option.output === null) {
        OutputHelper.text(`${response.items[0].constructor.name.toUpperCase()} - Potential saving opportunities found ⬇️`, 'info')
        OutputHelper[option.outputFormat](this.responseDecorator.decorate(cloudProvider, [response], { output: Output.DETAILED, showLabels: option.showLabels }))
      }
      if (option.output === Output.SUMMARIZED || option.output === null) {
        summaryData = [...summaryData, ...this.responseDecorator.decorate(cloudProvider, [response], { output: Output.SUMMARIZED, showLabels: option.showLabels })]
      }
    })
    if (summaryData.length > 0) {
      OutputHelper.text('Overall summary ⬇️', 'info')
      OutputHelper[option.outputFormat](this.responseDecorator.sortByPriceSummary(summaryData))
    }
    if (found && !!subCommand) {
      OutputHelper.text(`Please run ${chalk.underline.hex(COLORS.ORCHID)('c8r clean [options] ' + subCommand)} with the same filters if you wish to clean.`)
    } else if (!found) {
      OutputHelper.text('We found no resources matching provided filters, please modify and try again!', 'warning')
    }
    let isSuccessful: boolean = true
    const logFilename = `${OutputDirectory}/logs/${moment().format('YYYY-MM-DD')}.log`
    responses.forEach((response) => {
      response.errors.forEach((error: any) => {
        isSuccessful = false
        LoggerHelper.logFile(logFilename, error.message, error)
      })
    })
    if (!isSuccessful && !!subCommand) {
      OutputHelper.text(`There was an error while collecting resource information, some of the data may be incomplete or show N/A, more details - ${logFilename}`, 'warning')
    }
  }

  printCleanResponse (
    responses: Response<ProviderResource>[],
    cloudProvider: string,
    ids: object
  ): void {
    let price = 0
    let found = false
    responses.forEach((response) => {
      if (response.count === 0) {
        return
      }
      found = true
      const subCommand = response.items[0].constructor.name
      const decoratedData = this.responseDecorator.decorateClean(cloudProvider, response, ids[subCommand.toLowerCase()], subCommand)
      OutputHelper.table(decoratedData.data, true)
      price += decoratedData.price
    })
    if (found) {
      OutputHelper.text(`All done, you just saved ${String(chalk.green(this.responseDecorator.formatPrice(price)))} per month!!!`, 'superSuccess')
    } else {
      OutputHelper.table(this.responseDecorator.decorateCleanFailure(ids), true)
    }
  }
}

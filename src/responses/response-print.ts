import ResponseDecorator from './response-decorator'
import { ProviderResource, Response } from '@cloudchipr/cloudchipr-engine'
import { COLORS, Output } from '../constants'
import { OutputHelper } from '../helpers'
import chalk from 'chalk'

export default class ResponsePrint {
  private responseDecorator: ResponseDecorator

  constructor () {
    this.responseDecorator = new ResponseDecorator()
  }

  printCollectResponse (
    responses: Response<ProviderResource>[],
    cloudProvider: string,
    subCommand: string,
    output?: string,
    outputFormat?: string,
    showCleanCommandSuggestion: boolean = true
  ): void {
    let found = false
    let summaryData = []
    responses.forEach((response) => {
      if (response.count === 0) {
        return
      }
      found = true
      if (output === Output.DETAILED || output === null) {
        OutputHelper.text(`${response.items[0].constructor.name.toUpperCase()} - Potential saving opportunities found ⬇️`, 'info')
        OutputHelper[outputFormat](this.responseDecorator.decorate(cloudProvider, [response], Output.DETAILED))
      }
      if (output === Output.SUMMARIZED || output === null) {
        summaryData = [...summaryData, ...this.responseDecorator.decorate(cloudProvider, [response], Output.SUMMARIZED)]
      }
    })
    if (summaryData.length > 0) {
      OutputHelper.text('Overall summary ⬇️', 'info')
      OutputHelper[outputFormat](this.responseDecorator.sortByPriceSummary(summaryData))
    }
    if (found && showCleanCommandSuggestion) {
      OutputHelper.text(`Please run ${chalk.underline.hex(COLORS.ORCHID)('c8r clean [options] ' + subCommand)} with the same filters if you wish to clean.`)
    } else if (!found) {
      OutputHelper.text('We found no resources matching provided filters, please modify and try again!', 'warning')
    }
  }

  printCleanResponse (
    responses: Response<ProviderResource>[],
    ids: object
  ): void {
    let price = 0
    let found = false
    responses.forEach((response) => {
      if (response.count === 0) {
        return
      }
      found = true
      const subCommand = response.items[0].constructor.name.toLowerCase()
      const decoratedData = this.responseDecorator.decorateClean(response, ids[subCommand], subCommand)
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

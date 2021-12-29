import { OutputInterface } from './output-interface'
import Table from 'cli-table'
import chalk from 'chalk'

export class OutputRowFailure implements OutputInterface {
  public print (data: any): void {
    if (data.length === 0) { return }

    const table = new Table({
      chars: {
        top: '',
        'top-mid': '',
        'top-left': '',
        'top-right': '',
        bottom: '',
        'bottom-mid': '',
        'bottom-left': '',
        'bottom-right': '',
        left: '',
        'left-mid': '',
        mid: '',
        'mid-mid': '',
        right: '',
        'right-mid': '',
        middle: ' '
      }
    })

    data.forEach(x => {
      table.push([chalk.hex('#d06c1f')(`Failed to load ${x.subcommand} resources for account [${x.account}] and region [${x.region}]`)])
    })

    console.log(table.toString())
  }
}

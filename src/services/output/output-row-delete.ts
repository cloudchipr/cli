import { OutputInterface } from './output-interface'
import Table from 'cli-table'
import chalk from 'chalk'

export class OutputRowDelete implements OutputInterface {
  public print (data: any): void {
    const table = new Table({
      chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
        , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
        , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
        , 'right': '' , 'right-mid': '' , 'middle': ' ' }
    });

    data.forEach(x => {
      table.push([`Cleaning ${x.subcommand} ${OutputRowDelete.shorten(x.id)}`, chalk.hex(x.success ? '#00FF00' : '#CB3837')(x.success ? 'Done' : 'Failed')])
    })

    console.log(table.toString())
  }

  private static shorten (str: string): string {
    return str.length > 19 ? `${str.slice(0, 19)}...` : str
  }
}

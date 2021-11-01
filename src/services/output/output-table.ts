import Table from 'cli-table'
import { OutputInterface } from './output-interface'
import chalk from "chalk";

const COLORS = [
  '#999999',
  '#93C47D',
  '#8E7CC3',
  '#FFD966',
  '#CB3837',
  '#6D9EEB',
  '#76A5AF',
]

const ALL_UPPERCASE = [
  'Id',
  'Cpu',
  'Dns',
  'Ip',
  'Db',
]

export class OutputTable implements OutputInterface {
  public print (data: any): void {
    if (data.length === 0) { return }

    const headers = this.formatHeaders(Object.keys(data[0]))

    const table = new Table({
      chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
        , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
        , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
        , 'right': '' , 'right-mid': '' , 'middle': ' ' },
      head: headers.map((header, index) => chalk.hex(COLORS[index % COLORS.length]).bold(header))
    });

    data.forEach(x => {
      table.push(Object.values(x).map((x, index) => chalk.hex(COLORS[index % COLORS.length])(x)))
    })

    console.log(table.toString())
  }

  private formatHeaders (headers: string[]): string[] {
    return headers.map(header => {
      return header.split(/(?=[A-Z])/).map(h => {
        let tempHeader = h.charAt(0).toUpperCase() + h.slice(1)
        return ALL_UPPERCASE.includes(tempHeader) ? tempHeader.toUpperCase() : tempHeader
      }).join(' ')
    });
  }
}

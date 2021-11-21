import Table from 'cli-table'
import { OutputInterface } from './output-interface'
import chalk from 'chalk'

const COLORS = [
  '#999999',
  '#93C47D',
  '#8E7CC3',
  '#FFD966',
  '#CB3837',
  '#6D9EEB',
  '#76A5AF'
]

export class OutputTable implements OutputInterface {
  public print (data: any, context: object = {}): void {
    if (data.length === 0) { return }

    const table = new Table({
      chars: {
        top: context.hasOwnProperty('showTopBorder') ? '-' : '',
        'top-mid': '',
        'top-left': '',
        'top-right': '',
        bottom: context.hasOwnProperty('showBottomBorder') ? '-' : '',
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
      },
      head: Object.keys(data[0]).map((header, index) => chalk.hex(COLORS[index % COLORS.length]).bold(header))
    })

    data.forEach(x => {
      table.push(Object.values(x).map((x, index) => chalk.hex(COLORS[index % COLORS.length])(x)))
    })

    console.log(table.toString())
  }
}

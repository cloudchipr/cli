import chalk from 'chalk'
import Table from 'cli-table'
import prettyjson from 'prettyjson'
import terminalLink from 'terminal-link'
import { COLORS } from '../constants'

export class OutputHelper {
  static json (data: any): void {
    console.log(JSON.stringify(data, null, 4))
  }

  static link (title: string, url: string): void {
    console.log(terminalLink(chalk.underline(title), url))
  }

  static yaml (data: any): void {
    console.log(prettyjson.render(data, {
      keysColor: 'green',
      dashColor: 'yellow'
    }))
  }

  static text (data: any, type?: string): void {
    let message = typeof data === 'string' ? data : JSON.stringify(data)
    switch (type) {
      case 'superSuccess':
        message = `🎉🎉🎉\u200B${message}`
        break
      case 'success':
        message = chalk.hex(COLORS.GREEN)(`●\u200B${message}`)
        break
      case 'failure':
        message = chalk.hex(COLORS.RED)(`●\u200B${message}`)
        break
      case 'warning':
        message = chalk.hex(COLORS.ORANGE)(`●\u200B${message}`)
        break
      case 'info':
        message = chalk.hex(COLORS.BLUE)(`●\u200B${message}`)
        break
    }
    console.log(message)
  }

  static table (data: any, isDeletion: boolean = false): void {
    if (!Array.isArray(data) || data.length === 0) { return }

    const colors = Object.values(COLORS)
    const head = isDeletion ? [] : Object.keys(data[0]).map((header, index) => chalk.hex(colors[index % colors.length]).bold(header))

    const table = new Table({
      chars: {
        top: isDeletion ? '' : '-',
        'top-mid': '',
        'top-left': '',
        'top-right': '',
        bottom: isDeletion ? '' : '-',
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
      head: head
    })

    if (isDeletion) {
      data.forEach(x => {
        const id = x.id.length > 19 ? `${x.id.slice(0, 19)}...` : (x.id + new Array(23 - x.id.length).join(' '))
        table.push([`Cleaning ${x.subcommand} ${id}`, chalk.hex(x.success ? COLORS.GREEN : COLORS.RED)(x.success ? 'Done' : 'Failed')])
      })
    } else {
      data.forEach(x => {
        table.push(Object.values(x).map((x, index) => chalk.hex(colors[index % colors.length])(x)))
      })
    }

    console.log(table.toString())
  }
}

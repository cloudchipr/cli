import { OutputInterface } from './output-interface'
import chalk from 'chalk'

export class OutputText implements OutputInterface {
  public print (data: any, context: any = {}): void {
    let message = typeof data === 'string' ? data : JSON.stringify(data)
    switch (context.type) {
      case 'superSuccess':
        message = '🎉🎉🎉 ' + message
        break
      case 'success':
        message = chalk.green('● ' + message)
        break
      case 'warning':
        message = chalk.hex('#FFD800')('● ' + message)
        break
      case 'info':
        message = chalk.blue('● ' + message)
        break
    }
    console.log(message)
  }
}

import { OutputInterface } from './output-interface'

export class OutputText implements OutputInterface {
  public print (data: any, context: any = {}): void {
    let messagePrefix = ''
    switch (context.type) {
      case 'success':
        messagePrefix = '✅️ '
        break
      case 'superSuccess':
        messagePrefix = '🎉🎉🎉 '
        break
      case 'warning':
        messagePrefix = '🟡 '
        break
    }
    if (typeof data === 'string') {
      console.log(messagePrefix + data)
    } else {
      console.log(messagePrefix + JSON.stringify(data))
    }
  }
}

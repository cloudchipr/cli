import { OutputInterface } from './output-interface'

export class OutputText implements OutputInterface {
  public print (data: any): void {
    if (typeof data === 'string') {
      console.log(data)
    } else {
      console.log(JSON.stringify(data))
    }
  }
}

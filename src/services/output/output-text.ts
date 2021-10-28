import { OutputInterface } from './output-interface'

export class OutputText implements OutputInterface {
  public print (data: any): void {
    console.log(data)
  }
}

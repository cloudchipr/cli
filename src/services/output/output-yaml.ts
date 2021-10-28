import prettyjson from 'prettyjson'
import { OutputInterface } from './output-interface'

export class OutputYaml implements OutputInterface {
  public print (data: any): void {
    console.log(prettyjson.render(data, {
      keysColor: 'green',
      dashColor: 'yellow',
      stringColor: 'white'
    }))
  }
}

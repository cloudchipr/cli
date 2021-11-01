import { OutputFormats } from '../../constants'
import { OutputJson } from './output-json'
import { OutputYaml } from './output-yaml'
import { OutputTable } from './output-table'
import { OutputText } from './output-text'
import { OutputInterface } from './output-interface'
import { OutputRowDelete } from './OutputRowDelete';

export class OutputService {
  public print (data: any, format: string = 'text'): void {
    let output: OutputInterface
    switch (format) {
      case OutputFormats.JSON: {
        output = new OutputJson()
        break
      }
      case OutputFormats.YAML: {
        output = new OutputYaml()
        break
      }
      case OutputFormats.TABLE: {
        output = new OutputTable()
        break
      }
      case OutputFormats.ROW_DELETE: {
        output = new OutputRowDelete()
        break
      }
      default: {
        output = new OutputText()
      }
    }
    output.print(data)
  }
}

import { OutputFormats } from '../../constants'
import { OutputJson } from './output-json'
import { OutputRowFailure } from './output-row-failure'
import { OutputYaml } from './output-yaml'
import { OutputTable } from './output-table'
import { OutputText } from './output-text'
import { OutputInterface } from './output-interface'
import { OutputRowDelete } from './output-row-delete'

export class OutputService {
  public static print (data: any, format: string = 'text', context: any = {}): void {
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
      case OutputFormats.ROW_FAILURE: {
        output = new OutputRowFailure()
        break
      }
      default: {
        output = new OutputText()
      }
    }
    output.print(data, context)
  }
}

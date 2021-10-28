import Table from 'cli-table'
import { OutputInterface } from './output-interface'

export class OutputTable implements OutputInterface {
  public print (data: any): void {
    if (data.length === 0) { return }

    const table = new Table({
      head: Object.keys(data[0])
    })

    data.forEach(x => {
      table.push(Object.values(x))
    })

    console.log(table.toString())
  }
}

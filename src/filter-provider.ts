import { readFileSync } from 'fs'
import yaml from 'yaml'

export class FilterProvider {
  getFilter (filename: string) {
    return yaml.parse(readFileSync(filename, 'utf8'))
  }
}

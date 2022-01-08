import chalk from 'chalk'
import terminalLink from 'terminal-link'

export class OutputHelper {
  static link (title: string, url: string): void {
    console.log(terminalLink(chalk.underline(title), url))
  }
}

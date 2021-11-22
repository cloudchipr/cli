import { SPINNERS, SpinnerType } from './spinners';
import chalk from 'chalk'

export class SpinnerTest {
  private list = []
  private spinner: any
  private currentTimer: any

  constructor(spinnerType: string = 'dots') {
    this.spinner = SPINNERS['dots'];
  }

  public add(message: string): void {
    this.list.push(message)
  }

  public start() {
    // if (this.currentTimer) {
    //   return
    // }
    // let currentFrame = 0
    // const totalFrames = this.spinner.frames.length
    // this.currentTimer = setInterval(() => {
    //   let message = ''
    //   this.list.forEach((list) => {
    //     message = `${this.spinner.frames[currentFrame]} ${list}`
    //   })
    //   this.printOnCurrentLine(message)
    //   currentFrame = (currentFrame + 1) % totalFrames
    // }, this.spinner.interval)

    process.stdout.write(`aaa\n`)
    process.stdout.write(`bbb\n`)
    process.stdout.write(`ccc\n`)
    process.stdout.write(`ddd\n`)

    setInterval(() => {
      process.stdout.moveCursor(0, -4)
    }, 200)

    setInterval(() => {
      process.stdout.moveCursor(0, -4)
    }, 2000)
  }

  private clearCurrentLine(): void {
    process.stdout.clearLine(-1)
    process.stdout.cursorTo(0)
  }

  private printOnCurrentLine(message: string = ''): void {
    this.clearCurrentLine()
    process.stdout.write(`${message}`)
  }

  private printNewLine(): void {
    process.stdout.write(`\n`)
    process.stdout.cursorTo(0)
  }
}

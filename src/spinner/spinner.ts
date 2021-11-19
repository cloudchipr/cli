import { SPINNERS, SpinnerType } from './spinners';
import chalk from 'chalk'

export class Spinner {
  private static instance: Spinner
  private spinner: any
  private currentText: string
  private currentTimer: any

  private constructor(text: string = '', spinnerType: string) {
    this.setSpinnerType(spinnerType as keyof typeof SPINNERS)
    this.currentText = text
    this.currentTimer = null
  }

  public static getInstance(text: string = '', spinnerType: string = 'dots'): Spinner {
    if (Spinner.instance === undefined) {
      return new Spinner(text, spinnerType);
    } else {
      return Spinner.instance;
    }
  }

  public setSpinnerType(type: SpinnerType): void {
    if (SPINNERS[type]) {
      this.spinner = SPINNERS[type];
    } else {
      throw new Error(`unknown spinner type ${type}`);
    }
  }

  public setText(text: string = ''): Spinner {
    this.currentText = text
    return this
  }

  public start() {
    if (this.isRunning()) {
      throw new Error(
        "Can't start a new spinner while a spinner is already running!"
      );
    }
    let currentFrame = 0
    const totalFrames = this.spinner.frames.length
    this.currentTimer = setInterval(() => {
      let message = `${this.spinner.frames[currentFrame]} ${this.currentText}`
      this.printOnCurrentLine(message)
      currentFrame = (currentFrame + 1) % totalFrames
    }, this.spinner.interval)
  }

  public isRunning(): boolean {
    return this.currentTimer !== null
  }

  public succeed(text?: string) {
    this.stopSpinnerWithStatus('🟢', chalk.green(text))
  }

  public fail(text?: string) {
    this.stopSpinnerWithStatus('🔴', chalk.red(text))
  }

  public warn(text?: string) {
    this.stopSpinnerWithStatus('🟠', chalk.yellow(text))
  }

  public info(text?: string) {
    this.stopSpinnerWithStatus('🔵', chalk.yellow(text))
  }

  public stop(): void {
    this.stopSpinner()
    this.clearCurrentLine()
    this.setText('')
    this.printNewLine()
  }

  private stopSpinner(): void {
    if (this.currentTimer) {
      clearInterval(this.currentTimer)
    }
    this.currentTimer = null
  }

  private stopSpinnerWithStatus(status: string, text?: string) {
    this.setText('')
    const message = `${status} ${text}`
    this.stopSpinner()
    this.printOnCurrentLine(message)
    this.printNewLine()
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

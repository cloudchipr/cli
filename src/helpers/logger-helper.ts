import winston, { transports } from 'winston'

export class LoggerHelper {
  static logFile (filename: string, message: string, meta: any, level: string = 'error'): void {
    winston.createLogger({
      level: level,
      defaultMeta: { _timestamp: Date.now() }
    }).add(new transports.File({
      filename: filename,
      format: winston.format.prettyPrint()
    })).error(`${message}:`, meta)
  }
}

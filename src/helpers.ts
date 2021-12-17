import chalk from 'chalk'
import fs, { readFileSync } from 'fs'
import inquirer from 'inquirer'
import winston, { transports } from 'winston'
import { CustodianError, CustodianOrgError } from './exceptions'

const HOURS_IN_A_DAY = 24
const HOURS_IN_A_WEEK = 168

export function convertDateTimeToWeeksDaysHours(datetime?: string): string {
  if (datetime === undefined) {
    return 'N/A'
  }
  const now = new Date()
  const date = new Date(datetime)
  const totalHours = Math.ceil(Math.abs(now.valueOf() - date.valueOf()) / 36e5)

  if (totalHours < HOURS_IN_A_DAY) {
    return `${totalHours}h`
  } else if (totalHours < HOURS_IN_A_WEEK) {
    const days = Math.floor(totalHours / HOURS_IN_A_DAY)
    const hours = totalHours % HOURS_IN_A_DAY
    return `${days}d` + (hours > 0 ? ` ${hours}h` : '')
  } else {
    const weeks = Math.floor(totalHours / HOURS_IN_A_WEEK)
    const tempHours = totalHours % HOURS_IN_A_WEEK
    const days = Math.floor(tempHours / HOURS_IN_A_DAY)
    const hours = tempHours % HOURS_IN_A_DAY
    return `${weeks}w` + (tempHours === 0 ? '' : ` ${days}d` + (hours > 0 ? ` ${hours}h` : ''))
  }
}

export function getCustodian(): string {
  const custodian: string = process.env.C8R_CUSTODIAN
  if (custodian === undefined) {
    throw new CustodianError('Not provided')
  }

  try {
    fs.accessSync(custodian)
  } catch (err) {
    throw new CustodianError('Not provided or is not executable')
  }

  return custodian
}

export function getCustodianOrg(): string {
  const custodianOrg: string = process.env.C8R_CUSTODIAN_ORG
  if (custodianOrg === undefined) {
    throw new CustodianOrgError('Not provided')
  }

  try {
    fs.accessSync(custodianOrg)
  } catch (err) {
    throw new CustodianOrgError('Not provided or is not executable')
  }

  return custodianOrg
}

export function setEnvironmentVariable(key: string, value: any): void {
  process.env[key] = value
}

export function getEnvironmentVariable(key: string): any {
  return process.env[key]
}

export function getDefaultFilterPath(subcommand: string): string {
  return `${__dirname}/../default-filters/${subcommand}.yaml`
}

export function getDefaultFilter(subcommand: string): string {
  return readFileSync(getDefaultFilterPath(subcommand), 'utf8')
}

export function getFilterExample(subcommand: string): string {
  return `\n${chalk.yellow('Filter example (filter.yaml)')}:\n${getDefaultFilter(subcommand)}`
}

export function logFile(filename: string, message: string, meta: any, level: string = 'error'): void {
  winston.createLogger({
    level: level,
    defaultMeta: { _timestamp: Date.now() }
  }).add(new transports.File({
    filename: filename,
    format: winston.format.prettyPrint()
  })).error(`${message}:`, meta)
}

export function numberToFixed(value: number, decimals: number = 2): number {
  if (decimals < 0) {
    return value
  }
  return Math.trunc(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export async function confirm(question: string): Promise<boolean> {
  const confirm = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      prefix: '',
      message: question
    }
  ])
  return !!confirm.proceed
}

export function convertBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) {
    return '0 Bytes'
  }
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

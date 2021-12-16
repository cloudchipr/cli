import * as fs from 'fs'
import { CustodianError, CustodianOrgError } from '../exceptions'

export class EnvHelper {
  static getCustodian (): string {
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

  static getCustodianOrg (): string {
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

  static setEnvironmentVariable (key: string, value: any): void{
    process.env[key] = value
  }

  static getEnvironmentVariable (key: string): any {
    return process.env[key]
  }
}

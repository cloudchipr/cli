import fs from 'fs'
import { CustodianError } from '../exceptions/custodian-error'
import { CustodianOrgError } from '../exceptions/custodian-org-error'

export class CustodianHelper {
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
}

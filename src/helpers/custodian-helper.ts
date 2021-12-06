import fs from 'fs'

export class CustodianHelper {
  static getCustodian (): string {
    const custodian: string = process.env.C8R_CUSTODIAN
    if (custodian === undefined) {
      throw new Error('C8R_CUSTODIAN is not provided')
    }

    try {
      fs.accessSync(custodian)
    } catch (err) {
      throw new Error('C8R_CUSTODIAN is not provided or it not executable')
    }

    return custodian
  }

  static getCustodianOrg (): string {
    const custodianOrg: string = process.env.C8R_CUSTODIAN_ORG
    if (custodianOrg === undefined) {
      throw new Error('C8R_CUSTODIAN_ORG is not provided')
    }

    try {
      fs.accessSync(custodianOrg)
    } catch (err) {
      throw new Error('C8R_CUSTODIAN_ORG is not provided or it not executable')
    }

    return custodianOrg
  }
}

import AWS from 'aws-sdk/global'
import AwsCredential from './aws-credential'

export default class AwsCliManager {
  getCredentials (profile: string): AwsCredential {
    const credentials = new AWS.SharedIniFileCredentials({ profile })
    if (credentials.accessKeyId === undefined) { throw Error('Cannot find AWS credentials by profile: ' + profile) }

    return new AwsCredential(credentials.accessKeyId, credentials.secretAccessKey)
  }
}

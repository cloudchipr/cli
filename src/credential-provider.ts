import CredentialInterface from './credential-interface'
import AwsCliManager from './cloud-providers/aws/aws-cli-manager'
import { OptionValues } from 'commander'
import { CloudProvider } from './constants'

export default class CredentialProvider {
  getCredentials (provider: string, options: OptionValues): CredentialInterface {
    switch (provider) {
      case CloudProvider.AWS:
        return (new AwsCliManager()).getCredentials(
          options.profile
        )
      default:
        throw Error(`Invalid provider ${provider} provided`)
    }
  }
}

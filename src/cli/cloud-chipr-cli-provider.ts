import { CloudProvider } from '../constants'
import AwsCloudChiprCli from './aws-cloud-chipr-cli'
import CloudChiprCliInterface from './cloud-chipr-cli-interface'
import GcpCloudChiprCli from './gcp-cloud-chipr-cli'

export default class CloudChiprCliProvider {
  public static getProvider (cloudProvider?: string): CloudChiprCliInterface {
    switch (cloudProvider) {
      case CloudProvider.AWS:
        return new AwsCloudChiprCli()
      case CloudProvider.GCP:
        return new GcpCloudChiprCli()
      default:
        throw new Error(`option '--cloud-provider <cloud-provider>' argument '${cloudProvider}' is invalid. Allowed choices are ${Object.values(CloudProvider).join(', ')}`)
    }
  }
}

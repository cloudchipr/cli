import {CloudProvider} from "./cloud-providers/cloud-provider";
import CredentialInterface from "./credential-interface";
import AwsCliManager from "./cloud-providers/aws/aws-cli-manager";
import {OptionValues} from "commander";

export default class CredentialProvider {
    getCredentials(provider: CloudProvider, options: OptionValues): CredentialInterface {
        switch (provider) {
            case CloudProvider.aws:
                const awsCliManager = new AwsCliManager()
                return awsCliManager.getCredentials(
                    options.profile,
                    options.region,
                    options.accountId
                )
        }
    }
}
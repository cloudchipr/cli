import {CloudProvider} from "../constants";
import AwsCloudChiprCli from "./aws-cloud-chipr-cli";
import CloudChiprCliInterface from "./cloud-chipr-cli-interface";

export default class CloudChiprCliProvider {
    public static getProvider(cloudProvider: CloudProvider): CloudChiprCliInterface {
        switch (cloudProvider) {
            case CloudProvider.AWS:
                return new AwsCloudChiprCli();
            default:
                return new AwsCloudChiprCli();
        }
    }
}
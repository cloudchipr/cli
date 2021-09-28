import CloudProviderDecoratorInterface from "./cloud-provider-decorator-interface";
import {CloudProvider} from "../constants";
import AwsDecorator from "./aws-decorator";

export default class DecoratorProvider {
    getProvider(cloudProvider: CloudProvider): CloudProviderDecoratorInterface {
        switch (cloudProvider) {
            case CloudProvider.AWS:
                return new AwsDecorator();
            default:
                return new AwsDecorator();
        }
    }
}
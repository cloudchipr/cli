import CloudProviderDecoratorInterface from "./cloud-provider-decorator-interface";
import {Command, Option, OptionValues} from "commander";
import {Profile} from "../constants";
import {OutputService} from "../services/output/output-service";
import EngineRequestBuilder from "../engine-request-builder";
import {Command as CloudChiprCommand} from "cloudchipr-engine/lib/Command";
import {AwsSubCommand} from "cloudchipr-engine/lib/aws-sub-command";
import {AWSShellEngineAdapter} from "cloudchipr-engine/lib/adapters/aws-shell-engine-adapter";
import {EbsResponse} from "cloudchipr-engine/lib/responses/ebs-response";

export default class AwsDecorator implements CloudProviderDecoratorInterface{
    decorateCommand(command: Command): void {
        command
            .addOption(new Option('--account-id <account-id>', 'Account id'))
            .addOption(new Option('--profile <profile>', 'Profile').default(Profile.DEFAULT))
    }

    decorateCollectCommand(command: Command): void {
        const parentOptions = command.parent.opts();
        command
            .command('ebs')
            .option('-f, --filter <type>', 'Filter')
            .action((options) => {
                const output = new OutputService();
                const request = EngineRequestBuilder
                    .builder()
                    .setOptions(Object.assign(parentOptions, options) as OptionValues)
                    .setCommand(CloudChiprCommand.collect())
                    .setSubCommand(AwsSubCommand.ebs())
                    .build();

                const engineAdapter = new AWSShellEngineAdapter(process.env.C8R_CUSTODIAN as string)
                let response = engineAdapter.execute<EbsResponse>(request)

                output.print(response.items, parentOptions.outputFormat)
            });

        command
            .command('ec2')
            .option('-f, --filter <type>', 'Filter')
            .action((options) => {
                const output = new OutputService();
                output.print(parentOptions.region,parentOptions.outputFormat);
                console.log('collect ec2');
            });
    }
}
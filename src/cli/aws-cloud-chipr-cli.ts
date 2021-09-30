import {Command, Option, OptionValues} from "commander";
import {Profile} from "../constants";
import {OutputService} from "../services/output/output-service";
import EngineRequestBuilder from "../engine-request-builder";
import {AwsSubCommand, AWSShellEngineAdapter, EbsResponse, Command as CloudChiprCommand} from "@cloudchipr/cloudchipr-engine";
import CloudChiprCliInterface from "./cloud-chipr-cli-interface";

export default class AwsCloudChiprCli implements CloudChiprCliInterface {
     customiseCommand(command: Command): CloudChiprCliInterface {
        command
            .addOption(new Option('--account-id <account-id>', 'Account id'))
            .addOption(new Option('--profile <profile>', 'Profile').default(Profile.DEFAULT))

        return this;
    }

    customiseCollectCommand(command: Command): CloudChiprCliInterface {
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

        return this;
    }

    customiseCleanCommand(command: Command): CloudChiprCliInterface {
        return this;
    }
    customiseNukeCommand(command: Command): CloudChiprCliInterface {
        return this;
    }
}
import {Command, Option, OptionValues} from "commander";
import {Profile} from "../constants";
import {OutputService} from "../services/output/output-service";
import EngineRequestBuilder from "../engine-request-builder";
import {
    AwsSubCommand,
    AWSShellEngineAdapter,
    Command as CloudChiprCommand,
    Ec2, Ebs
} from "@cloudchipr/cloudchipr-engine";
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

                const engineAdapter = new AWSShellEngineAdapter<Ebs>(process.env.C8R_CUSTODIAN as string)
                let response = engineAdapter.execute(request)

                output.print(response.items, parentOptions.outputFormat)
            });

        command
            .command('ec2')
            .option('-f, --filter <type>', 'Filter')
            .action((options) => {
                const output = new OutputService();
                const request = EngineRequestBuilder
                    .builder()
                    .setOptions(Object.assign(parentOptions, options) as OptionValues)
                    .setCommand(CloudChiprCommand.collect())
                    .setSubCommand(AwsSubCommand.ec2())
                    .build();

                const engineAdapter = new AWSShellEngineAdapter<Ec2>(process.env.C8R_CUSTODIAN as string)
                let response = engineAdapter.execute(request)

                output.print(response.items, parentOptions.outputFormat)
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
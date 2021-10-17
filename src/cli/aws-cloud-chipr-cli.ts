import {Command, Option, OptionValues} from "commander";
import {Profile} from "../constants";
import {OutputService} from "../services/output/output-service";
import EngineRequestBuilder from "../engine-request-builder";
import {
    AwsSubCommand,
    AWSShellEngineAdapter,
    Command as CloudChiprCommand,
    Ec2, Ebs, Elb, Nlb, Alb
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

        command
            .command('elb')
            .option('--force <type>', 'Force')
            .option('-f, --filter <type>', 'Filter')
            .action((options) => {
                const output = new OutputService();
                const request = EngineRequestBuilder
                    .builder()
                    .setOptions(Object.assign(parentOptions, options) as OptionValues)
                    .setCommand(CloudChiprCommand.collect())
                    .setSubCommand(AwsSubCommand.elb())
                    .build();

                const engineAdapter = new AWSShellEngineAdapter<Elb>(process.env.C8R_CUSTODIAN as string)
                let response = engineAdapter.execute(request)

                output.print(response.items, parentOptions.outputFormat)
            });

        command
            .command('nlb')
            .option('-f, --filter <type>', 'Filter')
            .action((options) => {
                const output = new OutputService();
                const request = EngineRequestBuilder
                    .builder()
                    .setOptions(Object.assign(parentOptions, options) as OptionValues)
                    .setCommand(CloudChiprCommand.collect())
                    .setSubCommand(AwsSubCommand.nlb())
                    .build();

                const engineAdapter = new AWSShellEngineAdapter<Nlb>(process.env.C8R_CUSTODIAN as string)
                let response = engineAdapter.execute(request)

                output.print(response.items, parentOptions.outputFormat)
            });

        command
            .command('alb')
            .option('-f, --filter <type>', 'Filter')
            .action((options) => {
                const output = new OutputService();
                const request = EngineRequestBuilder
                    .builder()
                    .setOptions(Object.assign(parentOptions, options) as OptionValues)
                    .setCommand(CloudChiprCommand.collect())
                    .setSubCommand(AwsSubCommand.alb())
                    .build();

                const engineAdapter = new AWSShellEngineAdapter<Alb>(process.env.C8R_CUSTODIAN as string)
                let response = engineAdapter.execute(request)

                output.print(response.items, parentOptions.outputFormat)
            });

        return this;
    }

    customiseCleanCommand(command: Command): CloudChiprCliInterface {
        const parentOptions = command.parent.opts();
        command
            .command('ebs')
            .option('-f, --filter <type>', 'Filter')
            .action((options) => {
                const output = new OutputService();
                const request = EngineRequestBuilder
                    .builder()
                    .setOptions(Object.assign(parentOptions, options) as OptionValues)
                    .setCommand(CloudChiprCommand.clean())
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
                    .setCommand(CloudChiprCommand.clean())
                    .setSubCommand(AwsSubCommand.ec2())
                    .build();

                const engineAdapter = new AWSShellEngineAdapter<Ec2>(process.env.C8R_CUSTODIAN as string)
                let response = engineAdapter.execute(request)

                output.print(response.items, parentOptions.outputFormat)
            });

      command
        .command('elb')
        .option('--force <type>', 'Force')
        .option('-f, --filter <type>', 'Filter')
        .action((options) => {
          const output = new OutputService();
          const request = EngineRequestBuilder
            .builder()
            .setOptions(Object.assign(parentOptions, options) as OptionValues)
            .setCommand(CloudChiprCommand.clean())
            .setSubCommand(AwsSubCommand.elb())
            .build();

          const engineAdapter = new AWSShellEngineAdapter<Ec2>(process.env.C8R_CUSTODIAN as string)
          let response = engineAdapter.execute(request)

          output.print(response.items, parentOptions.outputFormat)
        });

      command
        .command('nlb')
        .option('--force <type>', 'Force')
        .option('-f, --filter <type>', 'Filter')
        .action((options) => {
          const output = new OutputService();
          const request = EngineRequestBuilder
            .builder()
            .setOptions(Object.assign(parentOptions, options) as OptionValues)
            .setCommand(CloudChiprCommand.clean())
            .setSubCommand(AwsSubCommand.nlb())
            .build();

          const engineAdapter = new AWSShellEngineAdapter<Ec2>(process.env.C8R_CUSTODIAN as string)
          let response = engineAdapter.execute(request)

          output.print(response.items, parentOptions.outputFormat)
        });

      command
        .command('alb')
        .option('--force <type>', 'Force')
        .option('-f, --filter <type>', 'Filter')
        .action((options) => {
          const output = new OutputService();
          const request = EngineRequestBuilder
            .builder()
            .setOptions(Object.assign(parentOptions, options) as OptionValues)
            .setCommand(CloudChiprCommand.clean())
            .setSubCommand(AwsSubCommand.alb())
            .build();

          const engineAdapter = new AWSShellEngineAdapter<Ec2>(process.env.C8R_CUSTODIAN as string)
          let response = engineAdapter.execute(request)

          output.print(response.items, parentOptions.outputFormat)
        });

        return this;
    }
    customiseNukeCommand(command: Command): CloudChiprCliInterface {
        return this;
    }
}
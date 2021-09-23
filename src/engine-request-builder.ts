import {EngineRequest} from "cloudchipr-engine/lib/EngineRequest";
import {Command} from "cloudchipr-engine/lib/Command";
import {SubCommandInterface} from "cloudchipr-engine/lib/SubCommandInterface";
import {Parameter} from "cloudchipr-engine/lib/Parameter";
import {Configuration} from "cloudchipr-engine/lib/Configuration";
import {OptionValues} from "commander";
import {CloudProvider} from "./cloud-providers/cloud-provider";
import CredentialProvider from "./credential-provider";
import {FilterBuilder} from "cloudchipr-engine/lib/filters/FilterBuilder";
import {FilterProvider} from "./filter-provider";

export default class EngineRequestBuilder {
    private options: OptionValues;
    private command: Command;
    private subCommand: SubCommandInterface;

    setOptions(options: OptionValues): EngineRequestBuilder {
        this.options = options;
        return this;
    }

    setCommand(command: Command): EngineRequestBuilder {
        this.command = command;
        return this;
    }

    setSubCommand(subCommand: SubCommandInterface): EngineRequestBuilder {
        this.subCommand = subCommand;
        return this;
    }

    build(): EngineRequest {
        return new EngineRequest(
            EngineRequestBuilder.buildConfiguration(this.options),
            this.command,
            this.subCommand,
            EngineRequestBuilder.buildParameter(this.options)
        );
    }

    public static builder(): EngineRequestBuilder
    {
        return new EngineRequestBuilder();
    }

    private static buildConfiguration(options: OptionValues): Configuration {
        const credentialProvider = new CredentialProvider()
        const credentials = credentialProvider.getCredentials(options.cloudProvider as CloudProvider, options);

        return new Configuration(credentials.getAccessKey(), credentials.getSecretKey(), options.region);
    }

    private static buildParameter(options: OptionValues): Parameter {
        const builder = new FilterBuilder();
        const filterProvider = new FilterProvider()
        const filter = builder.load(filterProvider.getFilter(options.filter)).toList();

        return new Parameter(filter, false);
    }
}
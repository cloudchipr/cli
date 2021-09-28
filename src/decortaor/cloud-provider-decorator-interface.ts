import {Command} from "commander";

export default interface CloudProviderDecoratorInterface {
    decorateCommand(command: Command): void;
    decorateCollectCommand(command: Command): void;
}
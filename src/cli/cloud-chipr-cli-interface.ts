import {Command} from "commander";

export default interface CloudChiprCliInterface {
    customiseCommand(command: Command): CloudChiprCliInterface;
    customiseCollectCommand(command: Command): CloudChiprCliInterface;
    customiseCleanCommand(command: Command): CloudChiprCliInterface;
    customiseNukeCommand(command: Command): CloudChiprCliInterface;
}
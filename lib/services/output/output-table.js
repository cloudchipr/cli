"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputTable = void 0;
var cli_table_1 = __importDefault(require("cli-table"));
var OutputTable = /** @class */ (function () {
    function OutputTable() {
    }
    OutputTable.prototype.print = function (data) {
        var table = new cli_table_1.default({
            head: ['TH 1 label', 'TH 2 label']
        });
        table.push(['First value', 'Second value'], ['First value', 'Second value']);
        console.log(table.toString());
    };
    return OutputTable;
}());
exports.OutputTable = OutputTable;

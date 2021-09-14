"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputService = void 0;
var constants_1 = require("../../constants");
var output_json_1 = require("./output-json");
var output_yaml_1 = require("./output-yaml");
var output_table_1 = require("./output-table");
var output_text_1 = require("./output-text");
var OutputService = /** @class */ (function () {
    function OutputService() {
    }
    OutputService.prototype.print = function (data, format) {
        if (format === void 0) { format = 'text'; }
        var output;
        switch (format) {
            case constants_1.OutputFormats.JSON: {
                output = new output_json_1.OutputJson();
                break;
            }
            case constants_1.OutputFormats.YAML: {
                output = new output_yaml_1.OutputYaml();
                break;
            }
            case constants_1.OutputFormats.TABLE: {
                output = new output_table_1.OutputTable();
                break;
            }
            default: {
                output = new output_text_1.OutputText();
            }
        }
        output.print(data);
    };
    return OutputService;
}());
exports.OutputService = OutputService;

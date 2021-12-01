"use strict";
exports.__esModule = true;
exports.OutputService = void 0;
var constants_1 = require("../../constants");
var output_json_1 = require("./output-json");
var output_yaml_1 = require("./output-yaml");
var output_table_1 = require("./output-table");
var output_text_1 = require("./output-text");
var output_row_delete_1 = require("./output-row-delete");
var OutputService = /** @class */ (function () {
    function OutputService() {
    }
    OutputService.print = function (data, format, context) {
        if (format === void 0) { format = 'text'; }
        if (context === void 0) { context = {}; }
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
            case constants_1.OutputFormats.ROW_DELETE: {
                output = new output_row_delete_1.OutputRowDelete();
                break;
            }
            default: {
                output = new output_text_1.OutputText();
            }
        }
        output.print(data, context);
    };
    return OutputService;
}());
exports.OutputService = OutputService;

"use strict";
exports.__esModule = true;
exports.OutputYaml = void 0;
var prettyjson_1 = require("prettyjson");
var OutputYaml = /** @class */ (function () {
    function OutputYaml() {
    }
    OutputYaml.prototype.print = function (data) {
        console.log(prettyjson_1["default"].render(data, {
            keysColor: 'green',
            dashColor: 'yellow',
            stringColor: 'white'
        }));
    };
    return OutputYaml;
}());
exports.OutputYaml = OutputYaml;

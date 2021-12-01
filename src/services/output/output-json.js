"use strict";
exports.__esModule = true;
exports.OutputJson = void 0;
var OutputJson = /** @class */ (function () {
    function OutputJson() {
    }
    OutputJson.prototype.print = function (data) {
        console.log(JSON.stringify(data, null, 4));
    };
    return OutputJson;
}());
exports.OutputJson = OutputJson;

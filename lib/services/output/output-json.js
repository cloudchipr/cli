"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputJson = void 0;
var OutputJson = /** @class */ (function () {
    function OutputJson() {
    }
    OutputJson.prototype.print = function (data) {
        var testData = {
            aaa: 12,
            bb: 'dasdasd',
            c: {
                d: 213123
            }
        };
        console.log(JSON.stringify(testData, null, 4));
    };
    return OutputJson;
}());
exports.OutputJson = OutputJson;

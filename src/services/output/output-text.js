"use strict";
exports.__esModule = true;
exports.OutputText = void 0;
var chalk_1 = require("chalk");
var OutputText = /** @class */ (function () {
    function OutputText() {
    }
    OutputText.prototype.print = function (data, context) {
        if (context === void 0) { context = {}; }
        var message = typeof data === 'string' ? data : JSON.stringify(data);
        switch (context.type) {
            case 'superSuccess':
                message = '🎉🎉🎉 ' + message;
                break;
            case 'success':
                message = chalk_1["default"].green('● ' + message);
                break;
            case 'warning':
                message = chalk_1["default"].hex('#FFD800')('● ' + message);
                break;
            case 'info':
                message = chalk_1["default"].blue('● ' + message);
                break;
        }
        console.log(message);
    };
    return OutputText;
}());
exports.OutputText = OutputText;

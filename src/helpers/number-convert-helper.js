"use strict";
exports.__esModule = true;
exports.NumberConvertHelper = void 0;
var NumberConvertHelper = /** @class */ (function () {
    function NumberConvertHelper() {
    }
    NumberConvertHelper.toFixed = function (value, decimals) {
        if (decimals === void 0) { decimals = 2; }
        if (decimals < 0) {
            return value;
        }
        return Math.trunc(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    };
    return NumberConvertHelper;
}());
exports.NumberConvertHelper = NumberConvertHelper;

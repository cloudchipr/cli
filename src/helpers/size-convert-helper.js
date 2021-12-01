"use strict";
exports.__esModule = true;
exports.SizeConvertHelper = void 0;
var SizeConvertHelper = /** @class */ (function () {
    function SizeConvertHelper() {
    }
    SizeConvertHelper.fromBytes = function (bytes, decimals) {
        if (decimals === void 0) { decimals = 2; }
        if (bytes === 0) {
            return '0 Bytes';
        }
        var k = 1024;
        var dm = decimals < 0 ? 0 : decimals;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };
    return SizeConvertHelper;
}());
exports.SizeConvertHelper = SizeConvertHelper;

"use strict";
exports.__esModule = true;
exports.FilterHelper = void 0;
var fs_1 = require("fs");
var FilterHelper = /** @class */ (function () {
    function FilterHelper() {
    }
    FilterHelper.getDefaultFilter = function (subcommand) {
        return (0, fs_1.readFileSync)("./default-filters/".concat(subcommand, ".yaml"), 'utf8');
    };
    return FilterHelper;
}());
exports.FilterHelper = FilterHelper;

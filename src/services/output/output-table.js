"use strict";
exports.__esModule = true;
exports.OutputTable = void 0;
var cli_table_1 = require("cli-table");
var chalk_1 = require("chalk");
var COLORS = [
    '#999999',
    '#93C47D',
    '#8E7CC3',
    '#FFD966',
    '#CB3837',
    '#6D9EEB',
    '#76A5AF'
];
var OutputTable = /** @class */ (function () {
    function OutputTable() {
    }
    OutputTable.prototype.print = function (data, context) {
        if (context === void 0) { context = {}; }
        if (data.length === 0) {
            return;
        }
        var table = new cli_table_1["default"]({
            chars: {
                top: context.hasOwnProperty('showTopBorder') ? '-' : '',
                'top-mid': '',
                'top-left': '',
                'top-right': '',
                bottom: context.hasOwnProperty('showBottomBorder') ? '-' : '',
                'bottom-mid': '',
                'bottom-left': '',
                'bottom-right': '',
                left: '',
                'left-mid': '',
                mid: '',
                'mid-mid': '',
                right: '',
                'right-mid': '',
                middle: ' '
            },
            head: Object.keys(data[0]).map(function (header, index) { return chalk_1["default"].hex(COLORS[index % COLORS.length]).bold(header); })
        });
        data.forEach(function (x) {
            table.push(Object.values(x).map(function (x, index) { return chalk_1["default"].hex(COLORS[index % COLORS.length])(x); }));
        });
        console.log(table.toString());
    };
    return OutputTable;
}());
exports.OutputTable = OutputTable;

"use strict";
exports.__esModule = true;
exports.OutputRowDelete = void 0;
var cli_table_1 = require("cli-table");
var chalk_1 = require("chalk");
var OutputRowDelete = /** @class */ (function () {
    function OutputRowDelete() {
    }
    OutputRowDelete.prototype.print = function (data) {
        var table = new cli_table_1["default"]({
            chars: {
                top: '',
                'top-mid': '',
                'top-left': '',
                'top-right': '',
                bottom: '',
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
            }
        });
        data.forEach(function (x) {
            table.push(["Cleaning ".concat(x.subcommand, " ").concat(OutputRowDelete.shorten(x.id)), chalk_1["default"].hex(x.success ? '#00FF00' : '#CB3837')(x.success ? 'Done' : 'Failed')]);
        });
        console.log(table.toString());
    };
    OutputRowDelete.shorten = function (str) {
        return str.length > 19 ? "".concat(str.slice(0, 19), "...") : str;
    };
    return OutputRowDelete;
}());
exports.OutputRowDelete = OutputRowDelete;

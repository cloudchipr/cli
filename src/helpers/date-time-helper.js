"use strict";
exports.__esModule = true;
exports.DateTimeHelper = void 0;
var HOURS_IN_A_DAY = 24;
var HOURS_IN_A_WEEK = 168;
var DateTimeHelper = /** @class */ (function () {
    function DateTimeHelper() {
    }
    DateTimeHelper.convertToWeeksDaysHours = function (datetime) {
        if (datetime === undefined) {
            return 'N/A';
        }
        var now = new Date();
        var date = new Date(datetime);
        var totalHours = Math.ceil(Math.abs(now.valueOf() - date.valueOf()) / 36e5);
        if (totalHours < HOURS_IN_A_DAY) {
            return "".concat(totalHours, "h");
        }
        else if (totalHours < HOURS_IN_A_WEEK) {
            var days = Math.floor(totalHours / HOURS_IN_A_DAY);
            var hours = totalHours % HOURS_IN_A_DAY;
            return "".concat(days, "d") + (hours > 0 ? " ".concat(hours, "h") : '');
        }
        else {
            var weeks = Math.floor(totalHours / HOURS_IN_A_WEEK);
            var tempHours = totalHours % HOURS_IN_A_WEEK;
            var days = Math.floor(tempHours / HOURS_IN_A_DAY);
            var hours = tempHours % HOURS_IN_A_DAY;
            return "".concat(weeks, "w") + (tempHours === 0 ? '' : " ".concat(days, "d") + (hours > 0 ? " ".concat(hours, "h") : ''));
        }
    };
    return DateTimeHelper;
}());
exports.DateTimeHelper = DateTimeHelper;

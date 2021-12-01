"use strict";
exports.__esModule = true;
var cloudchipr_engine_1 = require("@cloudchipr/cloudchipr-engine");
var constants_1 = require("../constants");
var EngineRequestBuilder = /** @class */ (function () {
    function EngineRequestBuilder(command) {
        this.setCommand(command);
    }
    EngineRequestBuilder.prototype.setOptions = function (options) {
        this.options = options;
        return this;
    };
    EngineRequestBuilder.prototype.setCommand = function (command) {
        this.command = command;
        return this;
    };
    EngineRequestBuilder.prototype.setSubCommand = function (subCommand) {
        this.subCommand = subCommand;
        return this;
    };
    EngineRequestBuilder.prototype.setIds = function (ids) {
        this.ids = ids;
        return this;
    };
    EngineRequestBuilder.prototype.build = function () {
        return new cloudchipr_engine_1.EngineRequest(this.command, this.subCommand, this.buildParameter(this.options, this.getFilter()), this.options.verbose === constants_1.Verbose.ENABLED);
    };
    EngineRequestBuilder.prototype.buildParameter = function (options, filter) {
        var regions = new Set(options.region);
        if (regions.has('all')) {
            regions = constants_1.AllRegions;
            regions = constants_1.AllRegions;
        }
        var accounts = new Set(options.accountId);
        return new cloudchipr_engine_1.Parameter(filter, false, Array.from(regions), Array.from(accounts));
    };
    return EngineRequestBuilder;
}());
exports["default"] = EngineRequestBuilder;

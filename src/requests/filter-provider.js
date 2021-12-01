"use strict";
exports.__esModule = true;
exports.FilterProvider = void 0;
var fs_1 = require("fs");
var yaml_1 = require("yaml");
var cloudchipr_engine_1 = require("@cloudchipr/cloudchipr-engine");
var constants_1 = require("../constants");
var FilterProvider = /** @class */ (function () {
    function FilterProvider() {
    }
    FilterProvider.getCollectFilter = function (options, subCommand) {
        var builder = new cloudchipr_engine_1.FilterBuilder(new cloudchipr_engine_1.FilterValidator(subCommand));
        return builder
            .load(yaml_1["default"].parse((0, fs_1.readFileSync)(options.filter, 'utf8')))
            .toList();
    };
    FilterProvider.getCleanFilter = function (ids, subCommand) {
        var builder = new cloudchipr_engine_1.FilterBuilder(new cloudchipr_engine_1.FilterValidator(subCommand));
        var resource;
        switch (subCommand.getValue()) {
            case constants_1.SubCommands.EBS:
                resource = 'volume-id';
                break;
            case constants_1.SubCommands.EC2:
                resource = 'instance-id';
                break;
            case constants_1.SubCommands.RDS:
                resource = 'db-instance-identifier';
                break;
            case constants_1.SubCommands.EIP:
                resource = 'public-ip';
                break;
            case constants_1.SubCommands.ELB:
            case constants_1.SubCommands.NLB:
            case constants_1.SubCommands.ALB:
                resource = 'load-balancer-name';
                break;
            default:
                throw new Error("Invalid subcommand [".concat(subCommand.getValue(), "] provided for clean command."));
        }
        ids.forEach(function (id) { return builder.or().resource(resource).equal(id); });
        return builder.toList();
    };
    return FilterProvider;
}());
exports.FilterProvider = FilterProvider;

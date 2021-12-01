"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var commander_1 = require("commander");
var constants_1 = require("../constants");
var output_service_1 = require("../services/output/output-service");
var cloudchipr_engine_1 = require("@cloudchipr/cloudchipr-engine");
var inquirer_1 = require("inquirer");
var chalk_1 = require("chalk");
var filter_helper_1 = require("../helpers/filter-helper");
var response_decorator_1 = require("../responses/response-decorator");
var engine_request_builder_factory_1 = require("../requests/engine-request-builder-factory");
var fs = require('fs');
var AwsCloudChiprCli = /** @class */ (function () {
    function AwsCloudChiprCli() {
        this.responseDecorator = new response_decorator_1["default"]();
    }
    AwsCloudChiprCli.prototype.customiseCommand = function (command) {
        command
            .addOption(new commander_1.Option('--region <string...>', 'Region, default uses value of AWS_REGION env variable')["default"]([]))
            .addOption(new commander_1.Option('--account-id <string...>', 'Account id')["default"]([]))
            .addOption(new commander_1.Option('--profile <profile>', 'Profile, default uses value of AWS_PROFILE env variable'));
        return this;
    };
    AwsCloudChiprCli.prototype.customiseCollectCommand = function (command) {
        var _this = this;
        var parentOptions = command.parent.opts();
        var _loop_1 = function (key) {
            command
                .command(key)
                .description(constants_1.SubCommandsDetail[key].collectDescription)
                .option('-f, --filter <type>', 'Filter')
                .action(function (options) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.executeSingleCollectCommand(key, parentOptions, options)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); })
                .addHelpText('after', this_1.getFilterExample(key));
        };
        var this_1 = this;
        for (var key in constants_1.SubCommandsDetail) {
            _loop_1(key);
        }
        command
            .command('all')
            .description('Collect app resources based on the specified filters')
            .option('-f, --filter <type>', 'Filter')
            .action(function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this
                            .executeAllCollectCommand(parentOptions)
                            .then(function (result) {
                            var responses = result;
                            if (parentOptions.output !== constants_1.Output.SUMMARIZED) {
                                responses.forEach(function (response) {
                                    if (response.count === 0) {
                                        return;
                                    }
                                    output_service_1.OutputService.print("".concat(response.items[0].constructor.name.toUpperCase(), " \u2B07\uFE0F"), constants_1.OutputFormats.TEXT, { type: 'success' });
                                    var context = {
                                        showTopBorder: true,
                                        showBottomBorder: true
                                    };
                                    output_service_1.OutputService.print(_this.responseDecorator.decorate([response], constants_1.Output.DETAILED), parentOptions.outputFormat, context);
                                });
                            }
                            if (parentOptions.output !== constants_1.Output.DETAILED) {
                                output_service_1.OutputService.print(_this.responseDecorator.decorate(responses, constants_1.Output.SUMMARIZED), parentOptions.outputFormat);
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        return this;
    };
    AwsCloudChiprCli.prototype.customiseCleanCommand = function (command) {
        var _this = this;
        var parentOptions = command.parent.opts();
        var _loop_2 = function (key) {
            command
                .command(key)
                .description(constants_1.SubCommandsDetail[key].cleanDescription)
                .option('--force', 'Force')
                .option('-f, --filter <type>', 'Filter')
                .action(function (options) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.executeSingleCleanCommandWithPrompt(key, parentOptions, options)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); })
                .addHelpText('after', this_2.getFilterExample(key));
        };
        var this_2 = this;
        for (var key in constants_1.SubCommandsDetail) {
            _loop_2(key);
        }
        return this;
    };
    // customiseNukeCommand (command: Command): CloudChiprCliInterface {
    //   return this
    // }
    AwsCloudChiprCli.prototype.executeSingleCollectCommand = function (target, parentOptions, options) {
        return __awaiter(this, void 0, void 0, function () {
            var providerResource, allOptions, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        providerResource = this.getProviderResourceFromString(target);
                        allOptions = Object.assign(parentOptions, { filter: options.filter || "./default-filters/".concat(target, ".yaml") });
                        return [4 /*yield*/, this.executeCollectCommand(cloudchipr_engine_1.AwsSubCommand[target](), allOptions)];
                    case 1:
                        response = _a.sent();
                        if (response.count === 0) {
                            output_service_1.OutputService.print('We found no resources matching provided filters, please modify and try again!', constants_1.OutputFormats.TEXT, { type: 'warning' });
                            return [2 /*return*/];
                        }
                        if (parentOptions.output !== null) {
                            output_service_1.OutputService.print(this.responseDecorator.decorate([response], parentOptions.output), parentOptions.outputFormat);
                        }
                        else {
                            output_service_1.OutputService.print(this.responseDecorator.decorate([response], constants_1.Output.DETAILED), parentOptions.outputFormat);
                            output_service_1.OutputService.print(this.responseDecorator.decorate([response], constants_1.Output.SUMMARIZED), parentOptions.outputFormat);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AwsCloudChiprCli.prototype.executeAllCollectCommand = function (parentOptions) {
        var promises = [];
        for (var key in constants_1.SubCommandsDetail) {
            var allOptions = Object.assign(parentOptions, { filter: "./default-filters/".concat(key, ".yaml") });
            var providerResource = this.getProviderResourceFromString(key);
            promises.push(this.executeCollectCommand(cloudchipr_engine_1.AwsSubCommand[key](), allOptions));
        }
        return Promise.all(promises);
    };
    AwsCloudChiprCli.prototype.executeCollectCommand = function (subcommand, options) {
        return this.executeCommand(cloudchipr_engine_1.Command.collect(), subcommand, options);
    };
    AwsCloudChiprCli.prototype.executeSingleCleanCommandWithPrompt = function (target, parentOptions, options) {
        return __awaiter(this, void 0, void 0, function () {
            var providerResource, allOptions, collect, confirm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        providerResource = this.getProviderResourceFromString(target);
                        allOptions = Object.assign(parentOptions, { filter: options.filter || "./default-filters/".concat(target, ".yaml") });
                        return [4 /*yield*/, this.executeCommand(cloudchipr_engine_1.Command.collect(), cloudchipr_engine_1.AwsSubCommand[target](), allOptions)];
                    case 1:
                        collect = _a.sent();
                        if (collect.count === 0) {
                            output_service_1.OutputService.print('We found no resources matching provided filters, please modify and try again!', constants_1.OutputFormats.TEXT, { type: 'warning' });
                            return [2 /*return*/];
                        }
                        confirm = true;
                        if (!!options.force) return [3 /*break*/, 3];
                        output_service_1.OutputService.print(this.responseDecorator.decorate([collect], constants_1.Output.DETAILED), constants_1.OutputFormats.TABLE);
                        return [4 /*yield*/, this.prompt(cloudchipr_engine_1.AwsSubCommand[target]().getValue())];
                    case 2:
                        confirm = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!confirm) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.executeCleanCommand(cloudchipr_engine_1.AwsSubCommand[target](), collect, parentOptions)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AwsCloudChiprCli.prototype.executeCleanCommand = function (subcommand, collect, options) {
        return __awaiter(this, void 0, void 0, function () {
            var ids, totalPrice, i, j, temporaryIds, response, decoratedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ids = this.responseDecorator.getIds(collect, subcommand.getValue());
                        totalPrice = 0;
                        i = 0, j = ids.length;
                        _a.label = 1;
                    case 1:
                        if (!(i < j)) return [3 /*break*/, 4];
                        temporaryIds = ids.slice(i, i + constants_1.CleanChunkSize);
                        return [4 /*yield*/, this.executeCommand(cloudchipr_engine_1.Command.clean(), subcommand, options, temporaryIds)];
                    case 2:
                        response = _a.sent();
                        decoratedData = this.responseDecorator.decorateClean(response, temporaryIds, subcommand.getValue());
                        output_service_1.OutputService.print(decoratedData.data, constants_1.OutputFormats.ROW_DELETE);
                        totalPrice += decoratedData.price;
                        _a.label = 3;
                    case 3:
                        i += constants_1.CleanChunkSize;
                        return [3 /*break*/, 1];
                    case 4:
                        output_service_1.OutputService.print("All done, you just saved ".concat(String(chalk_1["default"].green(this.responseDecorator.formatPrice(totalPrice))), " per month!!!"), constants_1.OutputFormats.TEXT, { type: 'superSuccess' });
                        return [2 /*return*/];
                }
            });
        });
    };
    AwsCloudChiprCli.prototype.executeCommand = function (command, subcommand, options, ids) {
        if (ids === void 0) { ids = []; }
        return __awaiter(this, void 0, void 0, function () {
            var request, custodianOrg, engineAdapter;
            return __generator(this, function (_a) {
                request = engine_request_builder_factory_1["default"]
                    .getInstance(command)
                    .setSubCommand(subcommand)
                    .setOptions(options)
                    .setIds(ids)
                    .build();
                if (!Array.isArray(options) && options.profile !== undefined) {
                    process.env.AWS_PROFILE = options.profile;
                }
                custodianOrg = (options['accountId'] != undefined && (new Set(options['accountId'])).size) ? this.getCustodianOrg() : undefined;
                engineAdapter = new cloudchipr_engine_1.AWSShellEngineAdapter(this.getCustodian(), custodianOrg);
                return [2 /*return*/, engineAdapter.execute(request)];
            });
        });
    };
    AwsCloudChiprCli.prototype.prompt = function (subcommand) {
        return __awaiter(this, void 0, void 0, function () {
            var confirm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, inquirer_1["default"].prompt([
                            {
                                type: 'confirm',
                                name: 'proceed',
                                prefix: '',
                                message: "All resources listed above will be deleted. Are you sure you want to proceed? "
                            }
                        ])];
                    case 1:
                        confirm = _a.sent();
                        return [2 /*return*/, !!confirm.proceed];
                }
            });
        });
    };
    AwsCloudChiprCli.prototype.getFilterExample = function (subcommand) {
        return "\n".concat(chalk_1["default"].yellow('Filter example (filter.yaml)'), ":\n").concat(filter_helper_1.FilterHelper.getDefaultFilter(subcommand));
    };
    // check if C8R_CUSTODIAN is provided and executable
    AwsCloudChiprCli.prototype.getCustodian = function () {
        var custodian = process.env.C8R_CUSTODIAN;
        if (custodian === undefined) {
            throw new Error('C8R_CUSTODIAN is not provided');
        }
        try {
            fs.accessSync(custodian);
        }
        catch (err) {
            throw new Error('C8R_CUSTODIAN is not provided or it not executable');
        }
        return custodian;
    };
    // check if C8R_CUSTODIAN is provided and executable
    AwsCloudChiprCli.prototype.getCustodianOrg = function () {
        var custodianOrg = process.env.C8R_CUSTODIAN_ORG;
        if (custodianOrg === undefined) {
            throw new Error('C8R_CUSTODIAN_ORG is not provided');
        }
        try {
            fs.accessSync(custodianOrg);
        }
        catch (err) {
            throw new Error('C8R_CUSTODIAN_ORG is not provided or it not executable');
        }
        return custodianOrg;
    };
    AwsCloudChiprCli.prototype.getProviderResourceFromString = function (target) {
        switch (target) {
            case constants_1.SubCommands.EBS:
                return cloudchipr_engine_1.Ebs;
            case constants_1.SubCommands.EC2:
                return cloudchipr_engine_1.Ec2;
            case constants_1.SubCommands.ELB:
                return cloudchipr_engine_1.Elb;
            case constants_1.SubCommands.NLB:
                return cloudchipr_engine_1.Nlb;
            case constants_1.SubCommands.ALB:
                return cloudchipr_engine_1.Alb;
            case constants_1.SubCommands.EIP:
                return cloudchipr_engine_1.Eip;
            case constants_1.SubCommands.RDS:
                return cloudchipr_engine_1.Rds;
        }
    };
    return AwsCloudChiprCli;
}());
exports["default"] = AwsCloudChiprCli;

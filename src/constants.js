"use strict";
var _a;
exports.__esModule = true;
exports.CleanChunkSize = exports.SubCommandsDetail = exports.AllRegions = exports.SubCommands = exports.OutputFormats = exports.Verbose = exports.Output = exports.CloudProvider = void 0;
var CloudProvider;
(function (CloudProvider) {
    CloudProvider["AWS"] = "aws";
})(CloudProvider = exports.CloudProvider || (exports.CloudProvider = {}));
var Output;
(function (Output) {
    Output["DETAILED"] = "detailed";
    Output["SUMMARIZED"] = "summarized";
})(Output = exports.Output || (exports.Output = {}));
var Verbose;
(function (Verbose) {
    Verbose["DISABLED"] = "0";
    Verbose["ENABLED"] = "1";
})(Verbose = exports.Verbose || (exports.Verbose = {}));
var OutputFormats;
(function (OutputFormats) {
    OutputFormats["JSON"] = "json";
    OutputFormats["YAML"] = "yaml";
    OutputFormats["TABLE"] = "table";
    OutputFormats["TEXT"] = "text";
    OutputFormats["ROW_DELETE"] = "row_delete";
})(OutputFormats = exports.OutputFormats || (exports.OutputFormats = {}));
var SubCommands;
(function (SubCommands) {
    SubCommands["EBS"] = "ebs";
    SubCommands["EC2"] = "ec2";
    SubCommands["ELB"] = "elb";
    SubCommands["NLB"] = "nlb";
    SubCommands["ALB"] = "alb";
    SubCommands["EIP"] = "eip";
    SubCommands["RDS"] = "rds";
})(SubCommands = exports.SubCommands || (exports.SubCommands = {}));
exports.AllRegions = new Set([
    'us-east-2',
    'us-east-1',
    'us-west-1',
    'us-west-2',
    'ca-central-1',
    'eu-central-1',
    'eu-west-1',
    'eu-west-2',
    'eu-west-3',
    'sa-east-1'
]);
exports.SubCommandsDetail = (_a = {},
    _a[SubCommands.EBS] = {
        collectDescription: 'Collect EBS volumes specific information based on provided filters.',
        cleanDescription: 'Terminate EBS volumes specific information based on provided filters.'
    },
    _a[SubCommands.EC2] = {
        collectDescription: 'Collect EC2 instance specific information based on provided filters.',
        cleanDescription: 'Terminate EC2 instance specific information based on provided filters.'
    },
    _a[SubCommands.ELB] = {
        collectDescription: 'Collect ELB specific information based on provided filters.',
        cleanDescription: 'Terminate ELB specific information based on provided filters.'
    },
    _a[SubCommands.NLB] = {
        collectDescription: 'Collect NLB specific information based on provided filters.',
        cleanDescription: 'Terminate NLB specific information based on provided filters.'
    },
    _a[SubCommands.ALB] = {
        collectDescription: 'Collect ALB specific information based on provided filters.',
        cleanDescription: 'Terminate ALB specific information based on provided filters.'
    },
    _a[SubCommands.EIP] = {
        collectDescription: 'Collect EIP specific information based on provided filters.',
        cleanDescription: 'Terminate EIP specific information based on provided filters.'
    },
    _a[SubCommands.RDS] = {
        collectDescription: 'Collect RDS database specific information based on provided filters.',
        cleanDescription: 'Terminate RDS database specific information based on provided filters.'
    },
    _a);
exports.CleanChunkSize = 5;

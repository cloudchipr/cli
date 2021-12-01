"use strict";
exports.__esModule = true;
var constants_1 = require("../constants");
var aws_cloud_chipr_cli_1 = require("./aws-cloud-chipr-cli");
var CloudChiprCliProvider = /** @class */ (function () {
    function CloudChiprCliProvider() {
    }
    CloudChiprCliProvider.getProvider = function (cloudProvider) {
        switch (cloudProvider) {
            case constants_1.CloudProvider.AWS:
                return new aws_cloud_chipr_cli_1["default"]();
            default:
                return new aws_cloud_chipr_cli_1["default"]();
        }
    };
    return CloudChiprCliProvider;
}());
exports["default"] = CloudChiprCliProvider;

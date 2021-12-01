"use strict";
exports.__esModule = true;
var engine_collect_request_builder_1 = require("./engine-collect-request-builder");
var engine_clean_request_builder_1 = require("./engine-clean-request-builder");
var EngineRequestBuilderFactory = /** @class */ (function () {
    function EngineRequestBuilderFactory() {
    }
    EngineRequestBuilderFactory.getInstance = function (command) {
        switch (command.getValue()) {
            case 'collect':
                return new engine_collect_request_builder_1["default"](command);
            case 'clean':
                return new engine_clean_request_builder_1["default"](command);
            default:
                throw new Error("Invalid command [".concat(command.getValue(), "] provided."));
        }
    };
    return EngineRequestBuilderFactory;
}());
exports["default"] = EngineRequestBuilderFactory;

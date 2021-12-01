"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var filter_provider_1 = require("./filter-provider");
var engine_request_builder_1 = require("./engine-request-builder");
var EngineCollectRequestBuilder = /** @class */ (function (_super) {
    __extends(EngineCollectRequestBuilder, _super);
    function EngineCollectRequestBuilder(command) {
        return _super.call(this, command) || this;
    }
    EngineCollectRequestBuilder.prototype.getFilter = function () {
        return filter_provider_1.FilterProvider.getCollectFilter(this.options, this.subCommand);
    };
    return EngineCollectRequestBuilder;
}(engine_request_builder_1["default"]));
exports["default"] = EngineCollectRequestBuilder;

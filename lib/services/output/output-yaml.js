"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputYaml = void 0;
var prettyjson_1 = __importDefault(require("prettyjson"));
var OutputYaml = /** @class */ (function () {
    function OutputYaml() {
    }
    OutputYaml.prototype.print = function (data) {
        var testData = {
            username: 'rafeca',
            url: 'asdad',
            twitter_account: 'sssss',
            projects: ['prettyprint', 'connfu']
        };
        console.log(prettyjson_1.default.render(testData, {
            keysColor: 'green',
            dashColor: 'yellow',
            stringColor: 'white'
        }));
    };
    return OutputYaml;
}());
exports.OutputYaml = OutputYaml;

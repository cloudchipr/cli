"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var date_time_helper_1 = require("../helpers/date-time-helper");
var size_convert_helper_1 = require("../helpers/size-convert-helper");
var number_convert_helper_1 = require("../helpers/number-convert-helper");
var constants_1 = require("../constants");
var ResponseDecorator = /** @class */ (function () {
    function ResponseDecorator() {
    }
    ResponseDecorator.prototype.decorate = function (resources, output) {
        var _this = this;
        resources = this.removeEmptyResourcesAndSortByPrice(resources);
        var data = [];
        resources.forEach(function (resource) {
            data = __spreadArray(__spreadArray([], data, true), _this.eachItem(resource, output), true);
        });
        return output === constants_1.Output.DETAILED ? data : this.sortByPriceSummary(data);
    };
    ResponseDecorator.prototype.decorateClean = function (resource, requestedIds, subcommand) {
        return this["".concat(subcommand, "Clean")](resource, requestedIds);
    };
    ResponseDecorator.prototype.getIds = function (resource, subcommand) {
        return this["".concat(subcommand, "GetIds")](resource);
    };
    ResponseDecorator.prototype.formatPrice = function (price) {
        return '$' + price.toFixed(2);
    };
    ResponseDecorator.prototype.removeEmptyResourcesAndSortByPrice = function (resources) {
        return resources.reduce(function (accumulator, pilot) {
            if (pilot.count > 0) {
                pilot.items.sort(function (a, b) { return b.pricePerMonth - a.pricePerMonth; });
                accumulator.push(pilot);
            }
            return accumulator;
        }, []);
    };
    ResponseDecorator.prototype.sortByPriceSummary = function (data) {
        return data.sort(function (a, b) { return parseFloat(b['Cost Per Month'].slice(1)) - parseFloat(a['Cost Per Month'].slice(1)); });
    };
    ResponseDecorator.prototype.eachItem = function (resource, output) {
        switch (output) {
            case constants_1.Output.DETAILED:
                return this.eachItemDetail(resource);
            case constants_1.Output.SUMMARIZED:
                return this.eachItemSummary(resource);
        }
    };
    ResponseDecorator.prototype.eachItemDetail = function (resource) {
        var _this = this;
        return resource.items.map(function (item) {
            var data = _this[item.constructor.name.toLowerCase()](item);
            if (item.c8rRegion) {
                data.Region = item.c8rRegion;
            }
            if (item.c8rAccount) {
                data.Account = item.c8rAccount;
            }
            return data;
        });
    };
    ResponseDecorator.prototype.eachItemSummary = function (resource) {
        var totalPrice = resource.items.map(function (o) { return o.pricePerMonth; }).reduce(function (a, b) { return a + b; }, 0);
        return [
            {
                Service: resource.items[0].constructor.name.toUpperCase(),
                'Cost Per Month': this.formatPrice(totalPrice)
            }
        ];
    };
    ResponseDecorator.prototype.ec2 = function (ec2) {
        return {
            'Instance ID': ec2.id,
            'Instance Type': ec2.type,
            'CPU %': number_convert_helper_1.NumberConvertHelper.toFixed(ec2.cpu),
            NetIn: size_convert_helper_1.SizeConvertHelper.fromBytes(ec2.networkIn),
            NetOut: size_convert_helper_1.SizeConvertHelper.fromBytes(ec2.networkOut),
            'Price Per Month': this.formatPrice(ec2.pricePerMonth),
            Age: date_time_helper_1.DateTimeHelper.convertToWeeksDaysHours(ec2.age),
            'Name Tag': ec2.nameTag
        };
    };
    ResponseDecorator.prototype.ec2Clean = function (resource, requestedIds) {
        var _this = this;
        var price = 0;
        var succeededIds = resource.items.map(function (item) {
            price += item.pricePerMonth;
            return item.id;
        });
        var data = requestedIds.map(function (id) { return _this.clean('EC2', id, succeededIds.includes(id)); });
        return {
            data: data,
            price: price
        };
    };
    ResponseDecorator.prototype.ec2GetIds = function (resource) {
        return resource.items.map(function (item) { return item.id; });
    };
    ResponseDecorator.prototype.ebs = function (ebs) {
        return {
            'Instance ID': ebs.id,
            'Instance Type': ebs.type,
            State: ebs.state,
            Size: ebs.size,
            Age: date_time_helper_1.DateTimeHelper.convertToWeeksDaysHours(ebs.age),
            'Price Per Month': this.formatPrice(ebs.pricePerMonth),
            'Name Tag': ebs.nameTag
        };
    };
    ResponseDecorator.prototype.ebsClean = function (resource, requestedIds) {
        var _this = this;
        var price = 0;
        var succeededIds = resource.items.map(function (item) {
            price += item.pricePerMonth;
            return item.id;
        });
        var data = requestedIds.map(function (id) { return _this.clean('EBS', id, succeededIds.includes(id)); });
        return {
            data: data,
            price: price
        };
    };
    ResponseDecorator.prototype.ebsGetIds = function (resource) {
        return resource.items.map(function (item) { return item.id; });
    };
    ResponseDecorator.prototype.rds = function (rds) {
        return {
            'DB ID': rds.id,
            'Instance Type': rds.instanceType,
            'Average Connection': rds.averageConnections,
            'Price Per Month': this.formatPrice(rds.pricePerMonth),
            'DB Type': rds.dbType,
            'Multi-AZ': rds.multiAZ ? 'Yes' : 'No',
            'Name Tag': rds.nameTag
        };
    };
    ResponseDecorator.prototype.rdsClean = function (resource, requestedIds) {
        var _this = this;
        var price = 0;
        var succeededIds = resource.items.map(function (item) {
            price += item.pricePerMonth;
            return item.id;
        });
        var data = requestedIds.map(function (id) { return _this.clean('RDS', id, succeededIds.includes(id)); });
        return {
            data: data,
            price: price
        };
    };
    ResponseDecorator.prototype.rdsGetIds = function (resource) {
        return resource.items.map(function (item) { return item.id; });
    };
    ResponseDecorator.prototype.eip = function (eip) {
        return {
            'IP Address': eip.ip,
            'Price Per Month': this.formatPrice(eip.pricePerMonth),
            'Name Tag': eip.nameTag
        };
    };
    ResponseDecorator.prototype.eipClean = function (resource, requestedIds) {
        var _this = this;
        var price = 0;
        var succeededIds = resource.items.map(function (item) {
            price += item.pricePerMonth;
            return item.ip;
        });
        var data = requestedIds.map(function (id) { return _this.clean('EIP', id, succeededIds.includes(id)); });
        return {
            data: data,
            price: price
        };
    };
    ResponseDecorator.prototype.eipGetIds = function (resource) {
        return resource.items.map(function (item) { return item.ip; });
    };
    ResponseDecorator.prototype.elb = function (elb) {
        return {
            'Load Balancer Name': elb.loadBalancerName,
            'DNS Name': elb.dnsName,
            Age: date_time_helper_1.DateTimeHelper.convertToWeeksDaysHours(elb.age),
            'Price Per Month': this.formatPrice(elb.pricePerMonth),
            'Name Tag': elb.nameTag
        };
    };
    ResponseDecorator.prototype.elbClean = function (resource, requestedIds) {
        var _this = this;
        var price = 0;
        var succeededIds = resource.items.map(function (item) {
            price += item.pricePerMonth;
            return item.loadBalancerName;
        });
        var data = requestedIds.map(function (id) { return _this.clean('ELB', id, succeededIds.includes(id)); });
        return {
            data: data,
            price: price
        };
    };
    ResponseDecorator.prototype.elbGetIds = function (resource) {
        return resource.items.map(function (item) { return item.loadBalancerName; });
    };
    ResponseDecorator.prototype.nlb = function (nlb) {
        return {
            'Load Balancer Name': nlb.loadBalancerName,
            'DNS Name': nlb.dnsName,
            Age: date_time_helper_1.DateTimeHelper.convertToWeeksDaysHours(nlb.age),
            'Price Per Month': this.formatPrice(nlb.pricePerMonth),
            'Name Tag': nlb.nameTag
        };
    };
    ResponseDecorator.prototype.nlbClean = function (resource, requestedIds) {
        var _this = this;
        var price = 0;
        var succeededIds = resource.items.map(function (item) {
            price += item.pricePerMonth;
            return item.loadBalancerName;
        });
        var data = requestedIds.map(function (id) { return _this.clean('Nlb', id, succeededIds.includes(id)); });
        return {
            data: data,
            price: price
        };
    };
    ResponseDecorator.prototype.nlbGetIds = function (resource) {
        return resource.items.map(function (item) { return item.loadBalancerName; });
    };
    ResponseDecorator.prototype.alb = function (alb) {
        return {
            'Load Balancer Name': alb.loadBalancerName,
            'DNS Name': alb.dnsName,
            Age: date_time_helper_1.DateTimeHelper.convertToWeeksDaysHours(alb.age),
            'Price Per Month': this.formatPrice(alb.pricePerMonth),
            'Name Tag': alb.nameTag
        };
    };
    ResponseDecorator.prototype.albClean = function (resource, requestedIds) {
        var _this = this;
        var price = 0;
        var succeededIds = resource.items.map(function (item) {
            price += item.pricePerMonth;
            return item.loadBalancerName;
        });
        var data = requestedIds.map(function (id) { return _this.clean('Alb', id, succeededIds.includes(id)); });
        return {
            data: data,
            price: price
        };
    };
    ResponseDecorator.prototype.albGetIds = function (resource) {
        return resource.items.map(function (item) { return item.loadBalancerName; });
    };
    ResponseDecorator.prototype.clean = function (subcommand, id, success) {
        return {
            subcommand: subcommand,
            id: id,
            success: success
        };
    };
    return ResponseDecorator;
}());
exports["default"] = ResponseDecorator;

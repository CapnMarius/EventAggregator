"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventAggregator = /** @class */ (function () {
    function EventAggregator() {
        this.subs = {};
        this._id = 0;
    }
    EventAggregator.getInstance = function (type) {
        if (type === void 0) { type = "main"; }
        if (EventAggregator.instances[type] === undefined) {
            EventAggregator.instances[type] = new EventAggregator();
        }
        return EventAggregator.instances[type];
    };
    EventAggregator.prototype.on = function (event, fn, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        if (Array.isArray(event)) {
            var subs_1 = event.map(function (e) { return _this.on(e, fn, once); });
            return {
                off: function () { return subs_1.forEach(function (sub) { return sub.off(); }); },
            };
        }
        else {
            return this.addSub(event, fn, once);
        }
    };
    EventAggregator.prototype.once = function (event, fn) {
        return this.on(event, fn, true);
    };
    EventAggregator.prototype.emit = function (event, data) {
        var _this = this;
        if (Array.isArray(event)) {
            event.forEach(function (e) { return _this.emit(e, data); });
        }
        else {
            this.emitSubs(event, data, event);
            this.emitSubs("*", data, event);
        }
        return this;
    };
    EventAggregator.prototype.off = function (event, id) {
        var index = this.subs[event].findIndex(function (sub) { return sub._id === id; });
        if (index >= 0) {
            this.subs[event].splice(index, 1);
        }
        return this;
    };
    EventAggregator.prototype.addSub = function (event, fn, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        if (this.subs[event] === undefined) {
            this.subs[event] = [];
        }
        var id = this.getNextId();
        this.subs[event].push({ _id: id, _fn: fn, once: once });
        return { off: function () { return _this.off(event, id); } };
    };
    EventAggregator.prototype.emitSubs = function (event, data, originalEvent) {
        if (this.subs[event] !== undefined) {
            for (var i = 0; i < this.subs[event].length; i++) {
                var sub = this.subs[event][i];
                if (typeof sub._fn === "function") {
                    sub._fn(data, originalEvent);
                    if (sub.once === true) {
                        this.off(event, sub._id);
                        i--;
                    }
                }
                else {
                    this.off(event, sub._id);
                    i--;
                }
            }
        }
    };
    EventAggregator.prototype.getNextId = function () {
        return this._id++;
    };
    EventAggregator.instances = {};
    return EventAggregator;
}());
var debounce = function (fn, threshhold, scope) {
    if (threshhold === void 0) { threshhold = 100; }
    if (scope === void 0) { scope = null; }
    var deferTimer;
    return function () {
        var args = arguments;
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
            fn.apply(scope, args);
        }, threshhold);
    };
};
exports.debounce = debounce;
var throttle = function (fn, threshhold, scope) {
    if (threshhold === void 0) { threshhold = 100; }
    if (scope === void 0) { scope = null; }
    var last;
    var deferTimer;
    return function () {
        var now = Date.now();
        var args = arguments;
        if (last && now < last + threshhold) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(scope, args);
            }, threshhold);
        }
        else {
            last = now;
            fn.apply(scope, args);
        }
    };
};
exports.throttle = throttle;
exports.default = EventAggregator;

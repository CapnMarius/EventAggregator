"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventAggregator = /** @class */ (function () {
    function EventAggregator() {
        this._subs = {};
        this._id = 0;
    }
    EventAggregator.getInstance = function (type) {
        if (type === void 0) { type = "main"; }
        if (EventAggregator._instances[type] === undefined)
            EventAggregator._instances[type] = new EventAggregator();
        return EventAggregator._instances[type];
    };
    EventAggregator.prototype.on = function (event, fn, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        if (Array.isArray(event)) {
            var subs_1 = event.map(function (x) { return _this.on(x, fn, once); });
            return {
                off: function () { return subs_1.forEach(function (x) { return x.off(); }); }
            };
        }
        if (this._subs[event] === undefined)
            this._subs[event] = [];
        var sub = { _id: this._nextId(), _fn: fn, once: once };
        this._subs[event].push(sub);
        return {
            off: function () {
                var index = _this._subs[event].indexOf(sub);
                if (index !== -1)
                    _this._subs[event].splice(index, 1);
            }
        };
    };
    EventAggregator.prototype.once = function (event, fn) {
        return this.on(event, fn, true);
    };
    EventAggregator.prototype.emit = function (event, data) {
        var _this = this;
        if (Array.isArray(event))
            event.forEach(function (x) { return _this.emit(x, data); });
        else {
            this._emit(event, data, event);
            this._emit("*", data, event);
        }
        return this;
    };
    EventAggregator.prototype.off = function (event) {
        var _this = this;
        if (Array.isArray(event))
            event.forEach(function (x) { return _this.off(x); });
        else
            delete this._subs[event];
        return this;
    };
    EventAggregator.prototype._emit = function (event, data, originalEvent) {
        if (this._subs[event] === undefined)
            return;
        this._subs[event] = this._subs[event].filter(function (x) {
            if (typeof x._fn !== "function")
                return false;
            x._fn(data, originalEvent);
            return !x.once;
        });
    };
    EventAggregator.prototype._nextId = function () {
        return this._id++;
    };
    EventAggregator._instances = {};
    return EventAggregator;
}());
exports.EventAggregator = EventAggregator;
exports.debounce = function (fn, threshhold, scope) {
    if (threshhold === void 0) { threshhold = 100; }
    if (scope === void 0) { scope = null; }
    var deferTimer;
    return (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () { return fn.apply(scope, args); }, threshhold);
    });
};
exports.throttle = function (fn, threshhold, scope) {
    if (threshhold === void 0) { threshhold = 100; }
    if (scope === void 0) { scope = null; }
    var last;
    var deferTimer;
    return (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var now = Date.now();
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
    });
};

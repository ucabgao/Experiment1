"use strict";
var lodash_1 = require('lodash');
var state_1 = require('../scripts/stores/state');
var stateWrapper_1 = require('../api/stateWrapper');
var plugins = lodash_1["default"](require('require-dir')('../plugins'))
    .values()
    .map(function (plugin) {
    return lodash_1["default"](plugin)
        .keys()
        .map(function (key) {
        var initializedPlugin = plugin[key]();
        return lodash_1["default"].extend({ name: key }, initializedPlugin);
    })
        .value();
})
    .flatten()
    .value();
console.info("Loaded plugins: " + lodash_1["default"].pluck(plugins, 'name'));
var PluginHandler = (function () {
    function PluginHandler() {
    }
    PluginHandler.hasCommand = function (msg) {
        return lodash_1["default"].startsWith(msg, '/');
    };
    PluginHandler.getCommandName = function (msg) {
        return msg.substr(1).split(' ')[0];
    };
    PluginHandler.getCommandArgs = function (msg) {
        return msg.substr(msg.split(' ')[0].length + 1);
    };
    PluginHandler.getCommandByName = function (command) {
        var foundCommand = lodash_1["default"].findWhere(plugins, { name: command });
        return foundCommand && foundCommand.run ? foundCommand : null;
    };
    PluginHandler.hasValidCommand = function (msg) {
        var command = this.getCommandName(msg);
        return this.getCommandByName(command);
    };
    PluginHandler._runCommand = function (command, opts) {
        if (opts === void 0) { opts = { msg: '', server: null, to: '' }; }
        var foundCommand = this.getCommandByName(command);
        var args = this.getCommandArgs(opts.msg);
        var irc = stateWrapper_1["default"]({
            state: state_1["default"].get(),
            server: opts.server,
            to: opts.to
        });
        return foundCommand.run(irc, args);
    };
    PluginHandler.runCommand = function (opts) {
        if (opts === void 0) { opts = { msg: '', server: null, to: '' }; }
        return this._runCommand(this.getCommandName(opts.msg), opts);
    };
    PluginHandler.loadUserMenu = function (user) {
        return lodash_1["default"](plugins)
            .filter(function (plugin) { return plugin.userMenu; })
            .map(function (plugin) { return plugin.userMenu(user); })
            .value();
    };
    return PluginHandler;
}());
exports.__esModule = true;
exports["default"] = PluginHandler;

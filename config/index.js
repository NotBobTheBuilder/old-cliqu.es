var settings  = require("./settings.json"),
    defaults  = require("./defaults.json"),

    _         = require("underscore"),
    mode      = process.env.NODE_MODE || "development";


module.exports = _.defaults(settings[mode] || {}, defaults[mode]);

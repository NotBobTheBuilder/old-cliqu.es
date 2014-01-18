var settings  = require("./settings.json"),
    mode      = process.env.NODE_MODE || "development";


module.exports = settings[mode];

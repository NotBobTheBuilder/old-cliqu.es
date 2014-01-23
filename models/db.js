var config    = require("../config"),
    Bookshelf = require("bookshelf");

module.exports = Bookshelf.initialize(config.db);

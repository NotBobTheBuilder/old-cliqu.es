var config    = require("../config"),
    Bookshelf = require("bookshelf"),
    db;

module.exports = Bookshelf.initialize(config.db);

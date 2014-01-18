var db  = require("./db"),
    Event,
    Group,
    User;

Event = db.Model.extend({
  "tableName": "events",
});
Event.Events = db.Collection.extend({
  "model": Event,
});

module.exports = {
  "Event": Event,
};

var db  = require("./db"),
    Event,
    Group,
    Ticket,
    User;

Event = db.Model.extend({
  "tableName": "events",

  "attendees": function() {
    return this.belongsToMany(User).through(Ticket, "event_id", "attendee_id");
  },
  "organisers": function() {
    return this.belongsToMany(User, "events_organisers", "event_id", "organiser_id");
  },
});
Event.Events = db.Collection.extend({
  "model": Event,
});

Ticket = db.Model.extend({
  "tableName": "tickets",

  "attendee": function() {
    return this.belongsTo(User, "attendee_id");
  },
  "event": function() {
    return this.belongsTo(Event, "event_id");
  },
});
Ticket.Tickets = db.Collection.extend({
  "model": Ticket,
});

User = db.Model.extend({
  "tableName": "users",

  "attending": function() {
    return this.belongsToMany(Event).through(Ticket, "attendee_id", "event_id");
  },
  "organising": function() {
    return this.belongsToMany(Event, "events_organisers", "organiser_id", "event_id");
  },
});
User.Users = db.Collection.extend({
  "model": User,
});

module.exports = {
  "Event": Event,
  "Ticket": Ticket,
  "User": User,
};

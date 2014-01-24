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
  "group": function() {
    return this.hasOne(Group, "group_id");
  },
});
Event.Events = db.Collection.extend({
  "model": Event,
});

Group = db.Model.extend({
  "tableName": "groups",

  "members": function() {
    return this.belongsToMany(User, "groups_members", "group_id", "member_id");
  },
  "organisers": function() {
    return this.belongsToMany(User, "groups_organisers", "group_id", "organiser_id");
  },
  "events": function() {
    return this.hasMany(Event);
  },
});
Group.Groups = db.Collection.extend({
  "model": Group,
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
  "Group": Group,
  "Ticket": Ticket,
  "User": User,
};

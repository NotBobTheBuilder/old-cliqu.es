var models  = require("../models"),

    routes  = ["users", "events", "groups", "auth"];

module.exports = function(app, auth, views) {

  app.use(function(req, res, next) {
    if (req.host === "cliqu.es") {
      req.group = null;
      return next();
    }
    models.Group.forge({
      "domain": req.host,
    }).fetch().exec(function(err, group) {
      if (err)    return res.send(500, "");
      if (!group) return res.send(404, "");

      req.group = group;
      next();
    });
  });

  app.get("/", function(req, res) {
    if (req.user) {
      res.render("home", {
        "user": req.user.toJSON(),
      });
    } else {
      res.render("index");
    }
  });

  app.get("/events/:id/ticket", function(req, res) {
    if (!req.user) {
      return res.format({
        "application/json": function() {
          res.send(401);
        },
        "text/html": function() {
          res.render("ticket", {
            "ticket": null,
            "user": null,
            "url": req.path,
          });
        },
      });
    }
    models.Ticket.forge({
      "attendee_id": req.user.id,
      "event_id":    req.params.id,
    }).fetch({
      "withRelated": ["attendee", "event"]
    }).exec(function(err, ticket) {
      res.format({
        "application/json": function() {
          if (ticket) {
            return res.json(ticket.toJSON());
          } else {
            return res.send(404, "");
          }
        },
        "text/html": function() {
          res.render("ticket", {
            "ticket": ticket && ticket.toJSON(),
            "user": req.user.toJSON(),
            "url": req.path,
          });
        },
      });
    });
  });

  app.post("/events/:id/ticket", auth.loggedIn, function(req, res) {
    models.Ticket.forge({
      "attendee_id": req.user.id,
      "event_id":    req.params.id,
    }).fetch().exec(function(err, ticket) {
      if (ticket !== null) {
        return res.format({
          "text/html": function() {
            res.redirect(303, req.path);
          },
        });
      }
      models.Ticket.forge({
        "attendee_id": req.user.id,
        "event_id":    req.params.id,
      }).save().exec(function(err, ticket) {
        ticket.load([
          "attendee",
          "event",
        ]).exec(function (err, ticket) {
          res.format({
            "application/json": function() {
              res.json(201, ticket.toJSON());
            },
            "text/html": function() {
              res.redirect(303, req.path);
            },
          });
        });
      });
    });
  });

  routes.map(function(route) {
    require("./" + route)(app, auth, views);
  });
};

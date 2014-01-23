var models  = require("../models"),

    routes  = ["users", "events"];

module.exports = function(app, auth, views) {

  app.get("/login", views.htmlOnly("/"), function(req, res) {
    res.render("login");
  });


  app.get("/register", views.htmlOnly("/"), function(req, res) {
    res.render("register");
  });

  app.post("/register", views.htmlOnly("/"), function(req, res) {
    models.User.forge({
      "email": req.body.username,
    }).fetch().exec(function (err, user) {
      if (err !== null)  return res.send(500, "");
      if (user !== null) return res.send(403, "username taken");

      function randomChar() {
        return Math.floor(Math.random() * 16).toString("16");
      }
      var resetKey = "0000-0000-0000-0000".replace(/0/g, randomChar);

      auth.hash(resetKey, function(err, hashed) {
        //TODO: validate email address
        models.User.forge({
          "email": req.body.username,
          "password": hashed,
          "awaitReset": 1,
        }).save().exec(function(err, user) {
          //TODO: Email reset key
          console.log(resetKey);
          res.redirect(303, "/users/" + user.id + "/reset");
        });
      });
    });
  });

  app.post("/auth/:auth", auth.login);

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

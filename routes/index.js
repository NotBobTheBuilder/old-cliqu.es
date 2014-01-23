var models  = require("../models"),
    config  = require("../config");

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

  app.get("/users/:id", function(req, res) {
    models.User.forge({
      "id": req.params.id,
    }).fetch().exec(function(err, user) {
      //TODO: Html rendering of user pages
      res.format({
        "application/json": function() {
          res.json(user.toJSON());
        },
      });
    });
  });

  app.get("/users/:id/reset", views.htmlOnly("/"), function(req, res) {
    models.User.forge({
      "id": req.params.id,
      "awaitReset": 1,
    }).fetch().exec(function(err, user) {
      if (user === null)
        return res.redirect(303, "/");
      res.render("reset-password", {user: user.toJSON()});
    });
  });

  app.post("/users/:id/reset", function(req, res) {
    models.User.forge({
      "id": req.params.id,
      "awaitReset": 1,
    }).fetch().exec(function(err, user) {
      if (user === null) return res.redirect(303, "/");

      auth.compare(req.body.resetCode, user.get("password"), function(err, eq) {
        if (eq) {
          return auth.hash(req.body.password, function(err, hashedPass) {
            return user.save({
              "password":   hashedPass,
              "awaitReset": 0,
            }, {
              "patch": true
            }).exec(function(err, user) {
              if(err) {
                res.send(500, "");
              } else {
                res.redirect(303, "/users/" + user.id);
              }
            });
          });
        }

        /* Pin Incorrect */
        res.redirect(303, "/users/" + user.id + "/reset");
      });
    });
  });

  app.post("/auth/:auth", auth.login);

  app.get("/events/:id", function(req, res) {
    models.Event.forge({"id": req.params.id})
                .fetch({"withRelated": ["attendees", "organisers"]})
                .exec(function(err, evt) {

      if (err !== null) return res.send(500, "");
      if (evt === null) return res.send(404, "");

      res.format({
        "text/calendar": function() {
          res.render("event.ics", evt.toJSON());
        },
        "text/html": function() {
          res.render("attendee_list", evt.toJSON());
        },
        "application/json": function() {
          res.json(evt.toJSON());
        }
      });
    });
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
};

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

      //TODO: validate email address
      models.User.forge({
        "email": req.body.username,
        "password": resetKey,
        "awaitReset": 1,
      }).save().exec(function(err, user) {
        //TODO: Email reset key
        console.log(resetKey);
        res.redirect(303, "/users/" + user.id + "/reset");
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

      if (user.get("password") === req.body.resetCode) {
        return user.save({
          "password":   req.body.password,
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
      }

      /* Pin Incorrect */
      res.send(303, "/users/" + user.id + "/reset");
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
};

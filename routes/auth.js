var models  = require("../models");

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

  app.get("/auth/twitter", auth.login("twitter", "auth"));
  app.get("/auth/twitter/callback", auth.login("twitter", "callback"));

};

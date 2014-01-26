var models  = require("../models");

module.exports = function(app, auth, views) {

  app.param("user", function(req, res, next, id) {
    models.User.forge({
      "id": id,
    }).fetch({
      "withRelated": [
        "attending",
        "organising",
        "organiser",
        "member",
      ],
    }).exec(function(err, user) {
      if (err) return next(err);
      req.params.user = user;
      next();
    });
  });

  app.get("/users/:user", function(req, res) {
    var user = req.params.user;
    //TODO: Html rendering of user pages
    res.format({
      "application/json": function() {
        res.json(user.toJSON());
      },
    });
  });

  app.get("/users/:user/reset", views.htmlOnly("/"), function(req, res) {
    var user = req.params.user;
    if (user === null)
      return res.redirect(303, "/");
    if (!user.get("awaitReset"))
      return res.redirect(303, "/users/" + user.id);
    res.render("reset-password", {user: user.toJSON()});
  });

  app.post("/users/:user/reset", function(req, res) {
    var user = req.params.user;
    if (user === null) return res.redirect(303, "/");
    if (!user.get("awaitReset")) return res.redirect(303, "/");

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
};

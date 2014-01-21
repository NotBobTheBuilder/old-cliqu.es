var config      = require("../config"),
    models      = require("../models"),

    passport    = require("passport"),
    local       = require("./local");


function validateAuth(req, res, next) {
  if (req.params.auth !== "local")
    return next(new Error("Authentication Method Not Permitted"));
  if (! ("username" in req.body && "password" in req.body))
    return next(new Error("email and password required"));
  return next();
}

function login(req, res, next) {
  validateAuth(req, res, function(err) {
    if (err) return next(err);
    passport.authenticate(req.params.auth, {
      "successRedirect": "/",
      "failureRedirect": "/login",
    })(req, res, next);
  });
}

function serializeUser(user, done) {
  done(null, user.id);
}

function deserializeUser(id, done) {
  models.User.forge({id: id})
             .fetch()
             .exec(done);
}

module.exports = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(local);

  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);

  return {
    validate:   validateAuth,
    login:      login,
  };
};

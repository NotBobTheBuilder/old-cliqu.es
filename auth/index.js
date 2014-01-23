var config      = require("../config"),
    models      = require("../models"),

    bcrypt      = require("bcrypt"),
    passport    = require("passport"),
    local       = require("./local")(bcrypt.compare);


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

function loggedIn(req, res, next) {
  if(!req.isAuthenticated())
    return res.redirect("/login");
  next();
}

function serializeUser(user, done) {
  done(null, user.id);
}

function deserializeUser(id, done) {
  models.User.forge({id: id})
             .fetch()
             .exec(done);
}

function hash(string, cb) {
  bcrypt.genSalt(function(err, salt) {
    if (err) return cb(err);
    bcrypt.hash(string, salt, cb);
  });
}

module.exports = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(local);

  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);

  return {
    validate:   validateAuth,
    loggedIn:   loggedIn,
    login:      login,
    hash:       hash,
    compare:    bcrypt.compare,
  };
};

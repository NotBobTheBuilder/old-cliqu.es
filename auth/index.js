var config      = require("../config"),
    models      = require("../models"),

    bcrypt      = require("bcrypt"),
    passport    = require("passport"),
    twitter     = require("./twitter"),
    local       = require("./local")(bcrypt.compare);

function login(mechanism, mode) {
  var redirects = {
    "successRedirect": "/",
    "failureRedirect": "/login",
  };
  switch(mechanism) {
    case "local": return passport.authenticate("local", redirects);
    case "twitter":
      return {
        "auth":     passport.authenticate("twitter"),
        "callback": passport.authenticate("twitter", redirects),
      }[mode];
  }
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
  
  if (config.twitter)
    passport.use(twitter(config.twitter));

  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);

  return {
    loggedIn:   loggedIn,
    login:      login,
    hash:       hash,
    compare:    bcrypt.compare,
  };
};

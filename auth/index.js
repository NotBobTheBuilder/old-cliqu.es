var config      = require("../config"),
    models      = require("../models"),

    bcrypt      = require("bcrypt"),
    passport    = require("passport"),
    twitter     = require("passport-twitter").Strategy;
    local       = require("./local")(bcrypt.compare);


function validateAuth(req, res, next) {
  console.log(req.params.auth);
  if (req.params.auth == "local"){
    if (! ("username" in req.body && "password" in req.body))
      return next(new Error("email and password required"));
  }
  else if(req.params.auth == "twitter")
    next(); //nop
  else
    return next(new Error("Authentication Method Not Permitted"));
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

  passport.use(new twitter({
    consumerKey: "D4ZfVI5PkwnvV0tTF8zeQw",
    consumerSecret: "qM6hlrHynTL3dalUNTPJ0PMJP3o0HkrD6QvSIzW2G6o",
    callbackURL: "http://127.0.0.1:1234/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log(token);
    //User.findOrCreate(..., function(err, user) {
    //  if (err) { return done(err); }
    //  done(null, user);
    //});
}
));

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

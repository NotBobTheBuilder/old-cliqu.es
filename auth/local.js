var models        = require("../models"),
    badAuth       = {"message": "incorrect email or password"},

    LocalStrategy = require("passport-local").Strategy;


module.exports = function(hash) {
  return new LocalStrategy(function(username, password, done) {
    models.User.forge({
      "email": username,
    }).fetch().exec(function(err, user) {
      if (err) return done(err);
      if (user === null) return done(null, false, badAuth);

      hash(password, function(err, hashedPass) {
        if (user.get("password") == hashedPass) {
          return done(null, user);
        } else {
          return done(null, false, badAuth);
        }
      });
    });
  });
};

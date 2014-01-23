var models        = require("../models"),
    badAuth       = {"message": "incorrect email or password"},

    LocalStrategy = require("passport-local").Strategy;


module.exports = function(compare) {
  return new LocalStrategy(function(username, password, done) {
    models.User.forge({
      "email": username,
    }).fetch().exec(function(err, user) {
      if (err) return done(err);
      if (user === null) return done(null, false, badAuth);

      compare(password, user.get("password"), function(err, eq) {
        return (eq) ? done(null, user)
                    : done(null, false, badAuth);
      });
    });
  });
};

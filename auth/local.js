var models        = require("../models"),

    LocalStrategy = require("passport-local").Strategy;


module.exports = new LocalStrategy(function(username, password, done) {
  models.User.forge({email: username})
        .fetch().exec(function(err, user) {
          if (err) done(err);
          // TODO: NOT SHIT SECURITY
          if (user && user.get("password") == password) {
            return done(null, user);
          } else {
            return done(null, false, {"message": "incorrect email or password"});
          }
        });
});

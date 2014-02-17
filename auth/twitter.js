var TwitterStrategy = require("passport-twitter").Strategy,
    models          = require("../models");

module.exports = function(config) {
  return new TwitterStrategy({
      "consumerKey": config.key,
      "consumerSecret": config.secret,
      "callbackURL": "https://cliqu.es/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
      models.ExternAuth.forge({
        "id": profile.id,
        "flavour": "twitter",
      }).fetch({
        "withRelated": "user"
      }).exec(function(err, auth) {
        if (auth === null) {
          models.User.forge({
            "display_name": profile.displayName,
          }).save().exec(function(err, user) {
            models.ExternAuth.forge({
              "id": profile.id,
              "flavour": "twitter",
              "user_id": user.id,
            }).save({}, {
              "method": "insert",
            }).exec(function() {
              done(null, user);
            });
          });
        } else {
          var user = auth.related("user");
          done(null, user);
        }
      });
    }
  );
};

var TwitterStrategy = require("passport-twitter").Strategy;

module.exports = function(config) {
  return new TwitterStrategy({
      "consumerKey": config.key,
      "consumerSecret": config.secret,
      "callbackURL": "http://127.0.0.1/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
      done(profile);
    }
  );
};

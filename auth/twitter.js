var TwitterStrategy = require("passport-twitter").Strategy;

module.exports = function(config) {
  return new TwitterStrategy({
      "consumerKey": config.key,
      "consumerSecret": config.secret,
      "callbackURL": "https://cliqu.es/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
      done(profile);
    }
  );
};

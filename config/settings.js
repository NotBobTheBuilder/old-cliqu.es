var settings = {};

if (process.env.twitter) {
  settings.twitter = {
    "key": process.env.twitter.split(":")[0],
    "secret": process.env.twitter.split(":")[1],
  };
}

if (process.env.NODE_PORT)
  settings.port = parseInt(process.env.NODE_PORT, 10);

module.exports = settings;

var config    = require("./config"),
    models    = require("./models"),
    routes    = require("./routes"),

    ifaces    = require("os").networkInterfaces(),
    express   = require("express"),
    app       = express();

app.use(express.bodyParser());

routes = routes(app, models, config);

app.listen(config.port);
console.log("Now listening on port " + config.port + " on addresses:");
Object.keys(ifaces)
  .forEach(function(iface) {
    ifaces[iface].forEach(function(addr) {
      if ("IPv4" === addr.family)
        console.log(addr.address);
    });
  });

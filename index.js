var config    = require("./config"),
    models    = require("./models"),
    routes    = require("./routes"),
    views     = require("./views"),
    auth      = require("./auth"),

    ifaces    = require("os").networkInterfaces(),
    express   = require("express"),
    app       = express();

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({"secret": config.sessionSecret}));

auth    = auth(app);
views   = views(app);
routes  = routes(app, auth, views);

app.listen(config.port);
console.log("Now listening on port " + config.port + " on addresses:");
Object.keys(ifaces)
  .forEach(function(iface) {
    ifaces[iface].forEach(function(addr) {
      if ("IPv4" === addr.family)
        console.log(addr.address);
    });
  });

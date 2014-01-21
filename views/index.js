var mustachex = require("mustachex");

module.exports = function(app) {
  app.engine("mst", mustachex.express);
  app.engine("ics", mustachex.express);
  app.set("view engine", "mst");
  app.set("views", "./views/mustache");
  app.set("layout", "site");
};

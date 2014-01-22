var mustachex = require("mustachex");

function acceptTypeRestriction(allow, redirect) {
  return function(req, res, next) {
    if (req.accepts(allow) === undefined)
      return res.redirect(303, redirect);
    next();
  };
}

acceptTypeRestriction.htmlOnly = function(redirect) {
  return acceptTypeRestriction("text/html", redirect);
};

module.exports = function(app) {
  app.engine("mst", mustachex.express);
  app.engine("ics", mustachex.express);
  app.set("view engine", "mst");
  app.set("views", "./views/mustache");
  app.set("layout", "site");

  return {
    "htmlOnly": acceptTypeRestriction.htmlOnly,
  };
};

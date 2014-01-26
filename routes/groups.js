var models = require("../models");

module.exports = function(app) {

  app.param("group", function(req, res, next, id) {
    models.Group.forge({
      "id": id,
    }).fetch({
      "withRelated": [
        "members",
        "events",
        "organisers",
      ],
    }).exec(function(err, group) {
      if (err) return next(err);
      req.params.group = group;
      next();
    });
  });

  app.get("/groups/:group", function(req, res) {
    if (req.params.group === null) return res.send(404, "");

    res.format({
      "application/json": function() {
        res.json(req.params.group.toJSON());
      },
    });
  });

  app.post("/groups/:group/github_pushed", function(req, res) {
    if(req.params.group === null) return res.send(404, ""); 

    var exec    = require("child_process").exec,
        url     = req.body.repository.url,
        domain  = req.params.group.get("domain");

    res.send(202, "Processing");

    exec("./clone-site.sh " + [domain, url].join(" "),
    function(err, stdout, stderr) {
      console.log("STDOUT: " + stdout);
      console.log("STDERR: " + stderr);
    });
  });
};

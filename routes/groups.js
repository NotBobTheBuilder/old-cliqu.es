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
};

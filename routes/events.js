var models = require("../models");

module.exports = function(app) {

  app.param("event", function(req, res, next, id) {
    models.Event.forge({
      "id": id,
    }).fetch({
      "withRelated": [
        "attendees",
        "organisers",
      ],
    }).exec(function(err, evt) {
      if (err) return next(err);
      req.params.event = evt;
      next();
    });
  });

  app.get("/events/:event", function(req, res) {
    if (req.params.event === null) return res.send(404, "");

    res.format({
      "text/calendar": function() {
        res.render("event.ics", req.params.event.toJSON());
      },
      "text/html": function() {
        res.render("attendee_list", req.params.event.toJSON());
      },
      "application/json": function() {
        res.json(req.params.event.toJSON());
      }
    });
  });
};

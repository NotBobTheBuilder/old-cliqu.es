module.exports = function(app, models, config) {

  app.get("/events/:id", function(req, res) {
    models.Event.forge({"id": req.params.id})
                .fetch({"withRelated": ["attendees", "organisers"]})
                .exec(function(err, evt) {

      if (err !== null) return res.send(500, "");
      if (evt === null) return res.send(404, "");

      res.format({
        "text/calendar": function() {
          res.render("event.ics", evt.toJSON());
        },
        "text/html": function() {
          res.render("attendee_list", evt.toJSON());
        },
        "application/json": function() {
          res.json(evt.toJSON());
        }
      });
    });
  });
};

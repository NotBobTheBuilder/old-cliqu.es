DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS events_organisers;

CREATE TABLE events (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  title,
  start,
  end,
  date
);

CREATE TABLE users (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  email,
  password,
  display_name
);

CREATE TABLE tickets (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  attendee_id,
  event_id
);

CREATE TABLE events_organisers (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  organiser_id,
  event_id
);

/*
Possibly useful [trivial] test data
*/
INSERT INTO events  (title)             VALUES ("Event 1");
INSERT INTO users   (display_name, email, password)      VALUES ("Foo Bar", "a@b", "password");
INSERT INTO users   (display_name, email, password)      VALUES ("Example", "c@d", "password");
INSERT INTO tickets (attendee_id, event_id) VALUES (1,1);

INSERT INTO events_organisers (organiser_id, event_id) VALUES (2, 1);

DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS groups_organisers;
DROP TABLE IF EXISTS groups_members;
DROP TABLE IF EXISTS events_organisers;

CREATE TABLE events (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  title,
  group_id,
  start,
  end,
  date
);

CREATE TABLE groups (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  name,
  domain,
  description
);

CREATE TABLE users (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  email,
  password,
  awaitReset,
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

CREATE TABLE groups_organisers (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  organiser_id,
  group_id
);

CREATE TABLE groups_members (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id,
  group_id
);

/*
Possibly useful [trivial] test data
INSERT INTO events  (title)             VALUES ("Event 1");
INSERT INTO users   (display_name, email, password, awaitReset)      VALUES ("Foo Bar", "a@b", "password", 0);
INSERT INTO users   (display_name, email, password, awaitReset)      VALUES ("Example", "c@d", "password", 0);
INSERT INTO tickets (attendee_id, event_id) VALUES (1,1);

INSERT INTO events_organisers (organiser_id, event_id) VALUES (2, 1);
*/

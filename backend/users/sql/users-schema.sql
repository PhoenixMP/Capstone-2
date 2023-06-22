CREATE TABLE user_profile (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE user_melodies (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES user_profile(username) ON DELETE CASCADE,
  melody_name VARCHAR(25) NOT NULL,
  time_stamp TIMESTAMP NOT NULL,
  music_notes JSON NOT NULL, 
  instrument_data JSON,
  visibility BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE game_songs (
  midi_id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  dir TEXT NOT NULL
);


CREATE TABLE user_game_scores (
  id SERIAL PRIMARY KEY,
  midi_id INT REFERENCES game_songs(midi_id) ON DELETE CASCADE,
  username VARCHAR(25) REFERENCES user_profile(username) ON DELETE CASCADE,
  time_stamp TIMESTAMP NOT NULL,
  score INT NOT NULL
);




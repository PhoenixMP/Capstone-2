CREATE TABLE user_profiles (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE user_game_scores (
  id SERIAL PRIMARY KEY,
  mp3_id INT NOT NULL,
  username VARCHAR(25) REFERENCES user_profiles(username) ON DELETE CASCADE,
  score INT NOT NULL,
  score_timestamp TIMESTAMP NOT NULL
);
CREATE TABLE songs (
  mp3_id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  dir TEXT NOT NULL,
  genre TEXT NOT NULL,
  song_length FLOAT,
  bpm FLOAT
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  mp3_id INTEGER REFERENCES songs(mp3_id) ON DELETE CASCADE,
  notes JSON
);

CREATE TABLE songs (
  midi_id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  dir TEXT NOT NULL,
  ticks_per_beat FLOAT
);

CREATE TABLE drum_tracks (
  id SERIAL PRIMARY KEY,
  midi_id INTEGER REFERENCES songs(midi_id) ON DELETE CASCADE,
  track_name TEXT,
  notes JSON
);

CREATE TABLE non_drum_tracks (
  id SERIAL PRIMARY KEY,
  midi_id INTEGER REFERENCES songs(midi_id) ON DELETE CASCADE,
  track_name TEXT,
  notes JSON
);

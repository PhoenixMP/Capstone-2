\echo 'Delete and recreate melodic2-songs db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE melodic2_songs;
CREATE DATABASE melodic2_songs;
\connect melodic2_songs

\i songs-schema.sql
\i song-data-seed.sql
\i non-drums-seed.sql
\i drums-seed.sql


\echo 'Delete and recreate melodic2-songs_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE melodic2_songs_test;
CREATE DATABASE melodic2_songs_test;
\connect melodic2_songs_test

\i songs-schema.sql


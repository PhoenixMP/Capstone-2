\echo 'Delete and recreate melodic2_users db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE melodic2_users;
CREATE DATABASE melodic2_users;
\connect melodic2_users

\i users-schema.sql
\i users-seed.sql

\echo 'Delete and recreate users_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE melodic2_users_test;
CREATE DATABASE melodic2_users_test;
\connect melodic2_users_test

\i users-schema.sql
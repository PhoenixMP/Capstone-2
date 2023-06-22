INSERT INTO user_profile (username, password, first_name, last_name, is_admin)
VALUES ('testuser1',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test1',
        'User1',
        TRUE),
        ('testuser2',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test2',
        'User2',
        FALSE);

INSERT INTO user_melodies (username, melody_name, time_stamp, music_notes, instrument_data, visibility)
VALUES ('testuser1', 'test melody1', '2023-06-20 10:30:00', '["some notes"]', '["some instrument data"]', FALSE),
       ('testuser1', 'test melody2', '2023-06-20 10:32:00', '["some notes"]', '["some instrument data"]', TRUE);
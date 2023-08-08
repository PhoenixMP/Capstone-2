"use strict";

const { generalDB } = require("../../db");
const fs = require('fs');
const path = require('path');

const { sqlForPartialUpdate } = require("../../helpers/sql");


const {
  NotFoundError
} = require("../../expressError");


const db = generalDB;


/*Related functions for songs. */

class Song {

  /*Find base64 encoded data for song MP3 file.

   Returns {encodedSong }
   */

  static async getmp3(mp3Id) {

    const folderPath = path.resolve(`./songs/mp3/${mp3Id}`);
    const songs = fs.readdirSync(folderPath);
    const song = songs[0]
    const songPath = path.join(folderPath, song);
    const songData = fs.readFileSync(songPath)
    const encodedSong = songData.toString('base64');
    const mp3Data = { encodedSong }


    return mp3Data
  };



  /*Find all Songs (optional filter on searchFilters).

   searchFilters (all optional):
   - title
   - dir

   Returns [{ mp3_id, title, dir, genre }, ...]
   */

  static async findAll(searchFilters = {}) {
    let query = `SELECT mp3_id,
                        title,
                        dir, genre
                 FROM songs`;
    let whereExpressions = [];
    let queryValues = [];

    const { title, dir } = searchFilters;


    // For each possible search term, add to whereExpressions and queryValues to
    //  generate the right SQL

    if (title) {
      queryValues.push(`%${title}%`);
      whereExpressions.push(`title ILIKE $${queryValues.length}`);
    }

    if (dir) {
      queryValues.push(`%${dir}%`);
      whereExpressions.push(`dir ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" OR ");
    }

    // Finalize query and return results

    query += " ORDER BY title";
    const songsRes = await db.query(query, queryValues);
    return songsRes.rows;
  }




  /*Find all Songs for specified genre 

   Returns [{ mp3_id, title, dir, genre }, ...]
   */

  static async searchGenre(genre) {
    const songsRes = await db.query(
      `SELECT mp3_id,
                        title,
                        dir, genre
                 FROM songs
                 WHERE genre = $1
                 ORDER BY title`,
      [genre]);
    return songsRes.rows;

  }

  /*Given a song id, return data about song.
   
   Returns {song: { mp3_id, title, dir, genre, song_length, bpm}, {notes}}
   Throws NotFoundError if the songs or it's notes are found.
   */

  static async get(mp3Id) {
    const songRes = await db.query(
      `SELECT mp3_id,
          title,
          dir, genre,
          song_length,
          bpm
          FROM songs
           WHERE mp3_id = $1`,
      [mp3Id]);

    const song = songRes.rows[0];

    if (!song) throw new NotFoundError(`No song: ${mp3Id}`);


    const notesRes = await db.query(
      `SELECT id, notes
           FROM notes
           WHERE mp3_id = $1`,
      [mp3Id]
    );

    let notes = notesRes.rows[0]
    if (!notes) throw new NotFoundError(`No notes: ${mp3Id}`);


    return { song, notes };
  }

  /*Update song data with `data`.
   
   This is a "partial update" --- only provided fields will be updated.
   Data can include: { title, dir, genre}
   
   Returns {mp3_id, title, dir, genre, song_length, bpm}
   
   Throws NotFoundError if song not found.
   */

  static async update(mp3Id, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        mp3Id: "mp3_id",
        songLength: "song_length",
      });
    const mp3IdVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE songs 
                      SET ${setCols} 
                      WHERE mp3_id = ${mp3IdVarIdx} 
                      RETURNING mp3_id, 
                                title, 
                                dir, genre, 
                                song_length,
                                bpm`;
    const result = await db.query(querySql, [...values, mp3Id]);
    const song = result.rows[0];

    if (!song) throw new NotFoundError(`No song: ${mp3Id}`);

    return song;
  }

  /*Delete given song from database; returns undefined.
   
   Throws NotFoundError if song not found.
   */

  static async remove(mp3Id) {
    const result = await db.query(
      `DELETE
           FROM songs
           WHERE mp3_id = $1
           RETURNING mp3_id`,
      [mp3Id]);
    const song = result.rows[0];

    if (!song) throw new NotFoundError(`No song: ${mp3Id}`);
  }
}


module.exports = Song;

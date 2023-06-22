"use strict";

const { generalDB } = require("../../db");
const bcrypt = require("bcrypt");
const fs = require('fs');
const path = require('path');



const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");

const { BCRYPT_WORK_FACTOR } = require("../../config.js");

const db = generalDB;


/** Related functions for songs. */

class Song {
  static async getMidi(midiId, baseUrl) {

    const folderPath = path.resolve(`./songs/midi/${midiId}`);
    const tracks = fs.readdirSync(folderPath)

    let song;
    for (const [i, file] of tracks.entries()) {
      if (file.includes('full.mid')) {
        song = tracks.splice(i, 1)
      }
    }


    const songPath = path.join(folderPath, song[0]);

    const songData = fs.readFileSync(songPath)
    const encodedSong = songData.toString('base64');




    // Prepare an array to store the encoded data for each track and the song
    const encodedTracks = [];
    // Iterate over each track
    tracks.forEach(track => {
      const trackPath = path.join(folderPath, track);

      // Read the contents of the track file

      const trackData = fs.readFileSync(trackPath);
      const encodedData = trackData.toString('base64');

      const parts1 = track.split('-');
      const parts2 = parts1[2].split('.')
      let trackName = `${parts1[1]} ${parts2[0]}`;
      trackName = trackName.charAt(0).toUpperCase() + trackName.slice(1);
      // Store the encoded data in the array
      encodedTracks.push({ midiName: track, trackName, encodedData });
    });

    const midiData = { encodedSong: { song: song[0], encodedSong }, encodedTracks }

    return midiData
  };



  // /** Find all Songs (optional filter on searchFilters).
  //  *
  //  * searchFilters (all optional):
  //  * - title
  //  * - dir
  //  * 
  //  *
  //  * Returns [{ midi_id, title, dir, ticks_per_beat }, ...]
  //  * */

  static async findAll(searchFilters = {}) {
    let query = `SELECT midi_id,
                        title,
                        dir,
                        ticks_per_beat
                 FROM songs`;
    let whereExpressions = [];
    let queryValues = [];

    const { title, dir } = searchFilters;


    // For each possible search term, add to whereExpressions and queryValues so
    // we can generate the right SQL

    if (title) {
      queryValues.push(`%${title}%`);
      whereExpressions.push(`title ILIKE $${queryValues.length}`);
    }

    if (dir) {
      queryValues.push(`%${dir}%`);
      whereExpressions.push(`dir ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    // Finalize query and return results

    query += " ORDER BY title";
    const songsRes = await db.query(query, queryValues);
    return songsRes.rows;
  }

  // /** Given a song, return data about song.
  //  *
  //  * Returns { midi_id, title, dir, ticks_per_beat, non_drum_tracks, drum_tracks}
  //  *   where non_drum_tracks is [{id, track_name}, ...]
  //  *   and where drum_tracks is [{id, track_name}, ...]

  //  *
  //  * Throws NotFoundError if not found.
  //  **/

  static async get(midiId) {
    const songRes = await db.query(
      `SELECT midi_id,
          title,
          dir,
          ticks_per_beat
          FROM songs
           WHERE midi_id = $1`,
      [midiId]);

    const song = songRes.rows[0];

    if (!song) throw new NotFoundError(`No song: ${midiId}`);

    const nonDrumTrackRes = await db.query(
      `SELECT id, track_name
           FROM non_drum_tracks
           WHERE midi_id = $1
           ORDER BY id`,
      [midiId]
    );

    const drumTrackRes = await db.query(
      `SELECT id, track_name
       FROM drum_tracks
       WHERE midi_id = $1
       ORDER BY id`,
      [midiId]
    );


    song.nonDrumTrack = nonDrumTrackRes.rows;
    song.drumTrack = drumTrackRes.rows;

    return song;
  }

  // /** Update song data with `data`.
  //  *
  //  * This is a "partial update" --- it's fine if data doesn't contain all the
  //  * fields; this only changes provided ones.
  //  *
  //  * Data can include: {midi_id, title, dir, ticks_per_beat}
  //  *
  //  * Returns {midi_id, title, dir, ticks_per_beat}
  //  *
  //  * Throws NotFoundError if not found.
  //  */

  static async update(midiId, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        midiId: "midi_id",
        ticksPerBeat: "ticks_per_beat",
      });
    const midiIdVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE songs 
                      SET ${setCols} 
                      WHERE midi_id = ${midiIdVarIdx} 
                      RETURNING midi_id, 
                                title, 
                                dir,  
                                ticks_per_beat`;
    const result = await db.query(querySql, [...values, midiId]);
    const song = result.rows[0];

    if (!song) throw new NotFoundError(`No song: ${midiId}`);

    return song;
  }

  // /** Delete given song from database; returns undefined.
  //  *
  //  * Throws NotFoundError if song not found.
  //  **/

  static async remove(midiId) {
    const result = await db.query(
      `DELETE
           FROM songs
           WHERE midi_id = $1
           RETURNING midi_id`,
      [midiId]);
    const song = result.rows[0];

    if (!song) throw new NotFoundError(`No song: ${midiId}`);
  }
}


module.exports = Song;

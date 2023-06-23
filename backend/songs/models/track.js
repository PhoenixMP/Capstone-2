"use strict";

const { generalDB } = require("../../db");
const bcrypt = require("bcrypt");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");

const { BCRYPT_WORK_FACTOR } = require("../../config.js");

const db = generalDB;

/** Related functions for tracks. */

class Track {



  /** Function for checking if provided track type is valid. */
  static checkType(type) {
    console.log(type)
    if (type !== "drum_tracks" && type !== "non_drum_tracks") {
      throw new BadRequestError(`Must specify valid track type`)
    }
  }

  // /** Find all tracks for a song.
  //  *
  //  * search filter option to get only non_drum_tracks:
  //  * 

  //  * Returns {non_drum_tracks, drum_tracks}
  //  *   where non_drum_tracks is [{id, track_name}, ...]
  //  *   and where drum_tracks is [{id, track_name}, ...]
  //  *   
  //  * */

  static async findAll(midiId, onlyNonDrum = false) {

    //check if song exists
    const songRes = await db.query(
      `SELECT midi_id,
              title,
              dir,
              song_length, bpm
              FROM songs
               WHERE midi_id = $1`,
      [midiId]);

    const song = songRes.rows[0];

    if (!song) throw new NotFoundError(`No song: ${midiId}`);

    const nonDrumTrackRes = await db.query(
      `SELECT id, track_name
           FROM non_drum_tracks
           WHERE midi_id = $1`,
      [midiId]
    );

    let nonDrumTracks = nonDrumTrackRes.rows

    if (onlyNonDrum) {
      return { nonDrumTracks };
    }

    const drumTrackRes = await db.query(
      `SELECT id, track_name
         FROM drum_tracks
         WHERE midi_id = $1`,
      [midiId]
    );

    let drumTracks = drumTrackRes.rows

    return { nonDrumTracks, drumTracks }
  }

  // /** From either non_drum_tracks or drum_tracks, return data about track.
  //  *
  //  * Returns {id, midi_id, track_name, notes}
  //  *
  //  * Throws BadRequestError if invalid type, NotFoundError if not found.
  //  **/

  static async get(id, type) {
    this.checkType(type)

    const trackRes = await db.query(
      `SELECT id, midi_id, track_name, notes
             FROM ${type}
             WHERE id = $1`,
      [id]);

    const track = trackRes.rows[0];

    if (!track) throw new NotFoundError(`No ${type}: ${id}`);

    return track;
  }

  // /** Update either non_drum_track or drum_track data with `data`.
  //  *
  //  * This is a "partial update" --- it's fine if data doesn't contain all the
  //  * fields; this only changes provided ones.
  //  *
  //  * Data can include: {midi_id, track_name, notes}
  //  *
  //  * Returns {id, midi_id, track_name, notes}
  //  *
  //  * Throws BadRequestError if invalid type, NotFoundError if not found.
  //  */

  static async update(id, data, type) {

    this.checkType(type)

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        midiId: "midi_id",
        trackName: "track_name",
      });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE ${type} 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                midi_id, 
                                track_name,  
                                notes`;
    const result = await db.query(querySql, [...values, id]);
    const track = result.rows[0];

    if (!track) throw new NotFoundError(`No track: ${id}`);

    return track;
  }

  // /** Delete given non_drum_track or drum_track from database; returns undefined.
  //  *
  //  * Throws BadRequestError if invalid type, NotFoundError if not found.
  //  **/

  static async remove(id, type) {

    this.checkType(type)

    const result = await db.query(
      `DELETE
           FROM ${type}
           WHERE id = $1
           RETURNING id`,
      [id]);
    const track = result.rows[0];

    if (!track) throw new NotFoundError(`No track: ${id}`);
  }

}


module.exports = Track;

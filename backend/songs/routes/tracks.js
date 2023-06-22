"use strict";

/** Routes for tracks. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../../expressError");
const { ensureAdmin, checkAPIToken } = require("../middleware/auth");
const Track = require("../models/track");


const trackUpdateSchema = require("../schemas/trackUpdate.json");


const router = new express.Router();



/** GET /[midiId]  =>
  //  * track: {non_drum_tracks, drum_tracks}
  //  *   where non_drum_tracks is [{id, track_name}, ...]
  //  *   and where drum_tracks is [{id, track_name}, ...]
  //  *   
 *
 * Can set onlyNonDrum to true/false
 *
 * Authorization required: API_token
 */

router.get("/midi-id/:midiId", checkAPIToken, async function (req, res, next) {
    try {
        const q = req.query;
        const p = req.params.midiId;
        console.log(q.only_non_drum)

        const tracks = await Track.findAll(p, q.only_non_drum);
        return res.json({ tracks });
    } catch (err) {
        return next(err);
    }
});

/** GET /[id]  =>  { track }
 * 
 * Must specify track type, drums or non-drums
 *
 *  track is { id, midiId, trackName, notes}
 *
 * Authorization required: API_token
 */

router.get("/id/:id", checkAPIToken, async function (req, res, next) {
    try {
        const q = req.query;
        const p = req.params.id;

        const track = await Track.get(p, q.type);
        return res.json({ track });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[id] { track } => { track }
 *
 * Patches track data.
 * 
 * Must specify track type, drums or non-drums
 *
 * fields can be: { midiId, trackName, ticksPerBeat}
 *
 * Returns { id, midiId, trackName, ticksPerBeat }
 *
 * Authorization required: admin
 */

router.patch("/id/:id", ensureAdmin, async function (req, res, next) {
    try {
        const q = req.query;
        const b = req.body;
        const p = req.params.id;

        const validator = jsonschema.validate(b, trackUpdateSchema);

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const track = await Track.update(p, b, q.type);
        return res.json({ track });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[id]  =>  { deleted: id }
 * 
 * Must specify track type, drums or non-drums
 *
 * Authorization: admin
 */

router.delete("/id/:id", ensureAdmin, async function (req, res, next) {
    try {
        const q = req.query;
        const p = req.params.id;

        await Track.remove(q.type, p);
        return res.json({ deleted: p });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;

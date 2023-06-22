"use strict";

/** Routes for songs. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../../expressError");
const { ensureAdmin, checkAPIToken } = require("../middleware/auth");
const Song = require("../models/song");



const songSearchSchema = require("../schemas/songSearch.json");
const songUpdateSchema = require("../schemas/songUpdate.json");


const router = new express.Router();


/** GET /  =>
 *   { songs: [ {midiId, title, dir, ticksPerBeat }, ...] }
 *
 * Can filter on provided search filters:
 * - title
 * - dir
 *
 * Authorization required: API_token
 */

router.get("/", checkAPIToken, async function (req, res, next) {
    const q = req.query;

    try {
        const validator = jsonschema.validate(q, songSearchSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const songs = await Song.findAll(q);
        return res.json({ songs });
    } catch (err) {
        return next(err);
    }
});


/** GET /[midiId]  =>  { song, midiFiles }
 *
 *  song is { midi_id, title, dir, ticksPerBeat, nonDrumTracks, drumTracks}
//  *   where nonDrumTracks is [{id, track_name}, ...]
//  *   and where drumTracks is [{id, track_name}, ...]
 *
 * Authorization required: API_token
 */

router.get("/:midiId", checkAPIToken, async function (req, res, next) {
    try {
        const midiId = req.params.midiId
        const song = await Song.get(midiId);
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const midiData = await Song.getMidi(midiId, baseUrl)



        // Additional JSON data to include in the response
        const jsonData = {
            song,
            midiData
        };

        // Set the content type as 'application/json'
        res.setHeader('Content-Type', 'application/json');
        // Send the JSON object as the response
        res.json(jsonData);

    } catch (err) {
        return next(err);
    }

});

/** PATCH /[midiId] { song } => { song }
 *
 * Patches song data.
 *
 * fields can be: { title, dir, ticksPerBeat}
 *
 * Returns { midiId, title, dir, ticksPerBeat }
 *
 * Authorization required: admin
 */

router.patch("/:midiId", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, songUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const song = await Song.update(req.params.midiId, req.body);
        return res.json({ song });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[midiId]  =>  { deleted: midiId }
 *
 * Authorization: admin
 */

router.delete("/:midiId", ensureAdmin, async function (req, res, next) {
    try {
        await Song.remove(req.params.midiId);
        return res.json({ deleted: req.params.midiId });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;

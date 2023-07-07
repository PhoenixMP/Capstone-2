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
 *   { songs: [ {mp3Id, title, dir, ticksPerBeat }, ...] }
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


/** GET /[mp3Id]  =>  { song, mp3Files }
 *
 *  song is { mp3_id, title, dir, ticksPerBeat, nonDrumTracks, drumTracks}
//  *   where nonDrumTracks is [{id, track_name}, ...]
//  *   and where drumTracks is [{id, track_name}, ...]
 *
 * Authorization required: API_token
 */

router.get("/:mp3Id", checkAPIToken, async function (req, res, next) {
    try {
        const mp3Id = req.params.mp3Id
        const songRes = await Song.get(mp3Id);
        const { song, notes } = songRes
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const mp3Data = await Song.getmp3(mp3Id, baseUrl)



        // Additional JSON data to include in the response
        const jsonData = {
            song, notes,
            mp3Data
        };

        // Set the content type as 'application/json'
        res.setHeader('Content-Type', 'application/json');
        // Send the JSON object as the response
        res.json(jsonData);

    } catch (err) {
        return next(err);
    }

});

/** PATCH /[mp3Id] { song } => { song }
 *
 * Patches song data.
 *
 * fields can be: { title, dir, ticksPerBeat}
 *
 * Returns { mp3Id, title, dir, ticksPerBeat }
 *
 * Authorization required: admin
 */

router.patch("/:mp3Id", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, songUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const song = await Song.update(req.params.mp3Id, req.body);
        return res.json({ song });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[mp3Id]  =>  { deleted: mp3Id }
 *
 * Authorization: admin
 */

router.delete("/:mp3Id", ensureAdmin, async function (req, res, next) {
    try {
        await Song.remove(req.params.mp3Id);
        return res.json({ deleted: req.params.mp3Id });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;

"use strict";

/** Routes for songs. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../../expressError");
const { ensureAdmin, checkAPIToken } = require("../../middleware/auth");
const Song = require("../models/song");



const songSearchSchema = require("../schemas/songSearch.json");
const songUpdateSchema = require("../schemas/songUpdate.json");


const router = new express.Router();


/** GET /  =>
 *   { songs: [{ mp3_id, title, dir, genre }, ...] }
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


/** GET /genre  =>
 *   { songs: [{ mp3_id, title, dir, genre }, ...] }
 *
 * Songs are filtered by genre, genre type must be validated via songSearchSchema
 *
 * Authorization required: API_token
 */
router.get("/genre", checkAPIToken, async function (req, res, next) {
    const q = req.query;

    try {
        const validator = jsonschema.validate(q, songSearchSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const songs = await Song.searchGenre(q.genre);
        return res.json({ songs });
    } catch (err) {
        return next(err);
    }
});


/** GET /[mp3Id]  =>  { song, notes, mp3Data }
 *
 *  song is { mp3_id, title, dir, genre, song_length, bpm }
 *  notes is {id, notes}
 *  mp3Data is {encodedSong}
 * Authorization required: API_token
 */

router.get("/:mp3Id", checkAPIToken, async function (req, res, next) {
    try {
        const mp3Id = req.params.mp3Id
        const songRes = await Song.get(mp3Id);
        const { song, notes } = songRes
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const mp3Data = await Song.getmp3(mp3Id, baseUrl)

        const jsonData = {
            song, notes,
            mp3Data
        };

        res.setHeader('Content-Type', 'application/json');
        res.json(jsonData);

    } catch (err) {
        return next(err);
    }

});



/** PATCH /[mp3Id] { song } => { song }
 *
 * Patches song data.
 *
 * fields can be: { title, dir, genre}
 * fields must be validated via songSearchSchema
 *
 * Returns {song: {mp3_id, title, dir, genre, song_length, bpm}}
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

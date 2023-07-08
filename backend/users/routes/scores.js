"use strict";

/** Routes for scores. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../../expressError");
const { checkAPIToken,
    authenticateJWT,
    ensureLoggedIn,
    ensureAdmin,
    ensureCorrectUserOrAdmin } = require("../middleware/auth");
const Score = require("../models/score");
const newScoreSchema = require("../schemas/newScore.json");


const router = new express.Router();





getUserTopScores(username, order)

getUsersSongScores(username, mp3_id, order)
getUserSongTopScore(username, mp3_id)

addScore(mp3_id, username, score)
removeScore(id)


/** GET /  =>
 *   { scores: [ {mp3Id, title, dir, ticksPerBeat }, ...] }
 *
 * Can filter on provided search filters:
 * - title
 * - dir
 *
 * Authorization required: API_token
 */

router.get("/top", checkAPIToken, async function (req, res, next) {
    const q = req.query;
    let order;
    (!q ? order = "time_stamp" : order = q.sort)

    try {
        const scores = await Score.findAllTopScores(order);
        return res.json({ scores });
    } catch (err) {
        return next(err);
    }
});

router.get("/:mp3Id/top", checkAPIToken, async function (req, res, next) {
    const mp3Id = req.params.mp3Id
    try {
        const scores = await Score.getSongTopScore(mp3Id);
        return res.json({ scores });
    } catch (err) {
        return next(err);
    }
});


router.get("/:mp3Id/:username/", checkAPIToken, async function (req, res, next) {
    const q = req.query;
    let order;
    (!q ? order = "time_stamp" : order = q.sort)

    try {
        const scores = await Score.findAllTopScores(order);
        return res.json({ scores });
    } catch (err) {
        return next(err);
    }
});





/** GET /[mp3Id]  =>  { score, mp3Files }
 *
 *  score is { mp3_id, title, dir, ticksPerBeat, nonDrumTracks, drumTracks}
//  *   where nonDrumTracks is [{id, track_name}, ...]
//  *   and where drumTracks is [{id, track_name}, ...]
 *
 * Authorization required: API_token
 */

router.get("/:mp3Id", checkAPIToken, async function (req, res, next) {
    try {
        const mp3Id = req.params.mp3Id
        const scoreRes = await score.get(mp3Id);
        const { score, notes } = scoreRes
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const mp3Data = await score.getmp3(mp3Id, baseUrl)



        // Additional JSON data to include in the response
        const jsonData = {
            score, notes,
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

/** PATCH /[mp3Id] { score } => { score }
 *
 * Patches score data.
 *
 * fields can be: { title, dir, ticksPerBeat}
 *
 * Returns { mp3Id, title, dir, ticksPerBeat }
 *
 * Authorization required: admin
 */


/** DELETE /[mp3Id]  =>  { deleted: mp3Id }
 *
 * Authorization: admin
 */

router.delete("/:mp3Id", ensureAdmin, async function (req, res, next) {
    try {
        await score.remove(req.params.mp3Id);
        return res.json({ deleted: req.params.mp3Id });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;

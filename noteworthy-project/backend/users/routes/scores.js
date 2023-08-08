"use strict";

/** Routes for scores. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../../expressError");
const { checkAPIToken,
    ensureAdmin,
    ensureCorrectUserOrAdmin } = require("../../middleware/auth");
const Score = require("../models/score");
const newScoreSchema = require("../schemas/newScore.json");


const router = new express.Router();


/** GET /  =>
  { scores: [{id, mp3Id, username, score, scoreTimestamp }, ...] }
 
  Authorization required: API_token
 */

router.get("/", checkAPIToken, async function (req, res, next) {

    try {
        const scores = await Score.findAll();
        return res.json({ scores });
    } catch (err) {
        return next(err);
    }
});


/** GET /top  =>
  { scores: [{id, mp3Id, username, score, scoreTimestamp }, ...] }
 
  Authorization required: API_token
 */
router.get("/top", checkAPIToken, async function (req, res, next) {

    try {
        const scores = await Score.findAllTopScores();
        return res.json({ scores });
    } catch (err) {
        return next(err);
    }
});


/** GET /[mp3Id]/top  =>
  { score: {id, username, score, scoreTimestamp } }
 
  Authorization required: API_token
 */
router.get("/:mp3Id/top", checkAPIToken, async function (req, res, next) {
    const mp3Id = req.params.mp3Id
    try {
        const score = await Score.getSongTopScore(mp3Id);
        return res.json({ score });
    } catch (err) {
        return next(err);
    }
});

/** GET /[mp3Id]/all-top  =>
  { scores: [{id, username, score, scoreTimestamp },...] }
 
  Authorization required: API_token
 */
router.get("/:mp3Id/all-top", checkAPIToken, async function (req, res, next) {
    const mp3Id = req.params.mp3Id
    try {
        const scores = await Score.getSongTopScores(mp3Id);
        return res.json({ scores });
    } catch (err) {
        return next(err);
    }
});


/** GET /[mp3Id]/all  =>
  { scores: [{id, username, score, scoreTimestamp }, ...] }
 
  Authorization required: API_token
 */
router.get("/:mp3Id/all", checkAPIToken, async function (req, res, next) {
    const mp3Id = req.params.mp3Id
    try {
        const scores = await Score.findAllSongScores(mp3Id);
        return res.json({ scores });
    } catch (err) {
        return next(err);
    }
});

/** GET /[mp3Id]/[username]/top  =>
  { score: {id, score, scoreTimestamp} }
 
  Authorization required: API_token, is correct user or is admin
 */

router.get("/:mp3Id/:username/top", checkAPIToken, ensureCorrectUserOrAdmin, async function (req, res, next) {
    const { mp3Id, username } = req.params;

    const q = req.query;
    let order;
    (q !== "undefined" ? order = "score_timestamp" : order = q.sort)


    try {
        const score = await Score.getUserSongTopScore(username, mp3Id);
        return res.json({ score });
    } catch (err) {
        return next(err);
    }
});



/** GET /[mp3Id]/[username]/all-scores  =>
  { scores: [{id, username, score, scoreTimestamp},...] }
 
  Authorization required: API_token, is correct user or is admin
 */
router.get("/:mp3Id/:username/all-scores", checkAPIToken, ensureCorrectUserOrAdmin, async function (req, res, next) {
    const { mp3Id, username } = req.params;
    const q = req.query;
    let order;
    (q !== "undefined" ? order = "score_timestamp" : order = q.sort)


    try {
        const scores = await Score.getUserSongScores(username, mp3Id, order);
        return res.json({ scores });
    } catch (err) {
        return next(err);
    }
});


/** GET /[username]/all-scores  =>
  { scores: [{mp3ID, {scores}},...]}
  where scores is [{score, scoreTimestamp}, ...] }
 
  Authorization required: API_token, is correct user or is admin
 */
router.get("/:username/all-scores", checkAPIToken, ensureCorrectUserOrAdmin, async function (req, res, next) {
    const username = req.params.username;

    const q = req.query;
    let order;
    (q !== "undefined" ? order = "score_timestamp" : order = q.sort)

    try {
        const scores = await Score.findAllUserScores(username, order);
        return res.json({ scores });
    } catch (err) {
        return next(err);
    }
});


/** GET /[username]/top-scores  =>
  { scores: [{id, username, mp3ID, score, scoreTimestamp},...] }
 
  Authorization required: API_token, is correct user or is admin
 */
router.get("/:username/top-scores", checkAPIToken, ensureCorrectUserOrAdmin, async function (req, res, next) {
    const username = req.params.username;

    const q = req.query;
    let order;
    (q !== "undefined" ? order = "score_timestamp" : order = q.sort)


    try {
        const scores = await Score.getUserTopScores(username, order);
        return res.json({ scores });
    } catch (err) {
        return next(err);
    }
});


/** GET /[username]/undefeated-scores  =>
  { scores: [{id, mp3Id, username, score, scoreTimestamp},...]}
 
  Authorization required: API_token, is correct user or is admin
 */
router.get("/:username/undefeated-scores", checkAPIToken, ensureCorrectUserOrAdmin, async function (req, res, next) {
    const username = req.params.username;

    const q = req.query;
    let order;
    (q !== "undefined" ? order = "score_timestamp" : order = q.sort)


    try {
        const scores = await Score.getUserUndefeatedTopScores(username, order);
        return res.json({ scores });
    } catch (err) {
        return next(err);
    }
});




/** POST /new-score  =>
{newScore: {mp3Id, username, score, scoreTimestamp}}
 
  Authorization required: is correct user or is admin
 */
router.post("/new-score", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, newScoreSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const { mp3Id, username, score } = req.body
        const intMp3Id = parseInt(mp3Id)

        const newScore = await Score.addScore(intMp3Id, username, score);
        return res.status(201).json({ newScore });
    } catch (err) {
        return next(err);
    }
});



/** DELETE /[id]  =>
{delted: id}
 
  Authorization required: API_token,is admin 
 */
router.delete("/:id", ensureAdmin, checkAPIToken, async function (req, res, next) {
    try {
        await Score.removeSCore(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;

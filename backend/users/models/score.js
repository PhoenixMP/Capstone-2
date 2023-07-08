"use strict";

const db = userDB;

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");


/** Related functions for users. */

class Score {


  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findAll() {
    const scoreRes = await db.query(
      `SELECT id,
              mp3_id AS "mp3Id",
              username,
              score,
              score_timestamp as "scoreTimestamp"
       FROM user_game_scores`,
    );

    return scoreRes.rows;
  }




  static async findAllSongScores(mp3_id) {
    const scoreRes = await db.query(
      `SELECT id, username,
      score, score_timestamp as "scoreTimestamp"
           FROM user_game_scores
           WHERE mp3_id = $1`,
      [mp3_id]
    );
    return scoreRes.rows;
  }


  static async findAllTopScores(order) {
    if (order !== "score" && order !== "score_timestamp") throw new BadRequestError(`Can't order by: ${order}`)
    const scoreRes = await db.query(
      `SELECT u.id, u.mp3_id, u.username, u.score as "topScore", u.score_timestamp as "scoreTimestamp"
      FROM user_game_scores u
      JOIN (
        SELECT mp3_id, MAX(score) AS "max_score"
        FROM user_game_scores
        GROUP BY mp3_id
      ) t ON u.mp3_id = t.mp3_id AND u.score = t.max_score
      ORDER BY ${order} DESC`
    );

    return scoreRes.rows;
  }



  static async findAllUserScores(username, order) {
    if (order !== "score" && order !== "score_timestamp") throw new BadRequestError(`Can't order by: ${order}`)
    const scoreRes = await db.query(
      `SELECT id, mp3_id as "mp3Id", username,
      score, score_timestamp as "scoreTimestamp"
           FROM user_game_scores
           WHERE username = $1
           GROUP BY mp3_id
           ORDER BY ${order} DESC`,
      [username]
    );
    return scoreRes.rows;
  }


  static async getUserTopScores(username, order) {
    if (order !== "score" && order !== "score_timestamp") throw new BadRequestError(`Can't order by: ${order}`)
    const scoreRes = await db.query(
      `SELECT s.id, s.username, s.mp3_id as "mp3Id", s.score, s.score_timestamp as "scoreTimestamp"
      FROM user_game_scores s
      JOIN (
        SELECT mp3_id, MAX(score) AS "max_score"
        FROM user_game_scores
        WHERE username = $1
        GROUP BY mp3_id
      ) t ON s.mp3_id = t.mp3_id AND s.score = t.max_score
      WHERE s.username = $1
      ORDER BY s.${order} DESC`,
      [username]
    );
    return scoreRes.rows;
  }

  static async getUserUndefeatedTopScores(username, order) {
    if (order !== "score" && order !== "score_timestamp") throw new BadRequestError(`Can't order by: ${order}`)
    const scoreRes = await db.query(
      `SELECT u.id, u.mp3_id, u.username, u.score as "topScore", u.score_timestamp as "scoreTimestamp"
      FROM user_game_scores u
      JOIN (
        SELECT mp3_id, MAX(score) AS "max_score"
        FROM user_game_scores
        GROUP BY mp3_id
      ) t ON u.mp3_id = t.mp3_id AND u.score = t.max_score
      WHERE s.username = $1
      ORDER BY ${order} DESC`,
      [username]
    );
    return scoreRes.rows;
  }

  static async getUserSongScores(username, mp3_id, order) {
    if (order !== "score" && order !== "score_timestamp") throw new BadRequestError(`Can't order by: ${order}`)
    const scoreRes = await db.query(
      `SELECT id, username,
      score, score_timestamp as "scoreTimestamp"
           FROM user_game_scores
           WHERE username = $1
           AND mp3_id=$2
           ORDER BY ${order} DESC`,
      [username, mp3_id]
    );
    return scoreRes.rows;
  }



  static async getSongTopScore(mp3_id) {
    const scoreRes = await db.query(
      `SELECT id, username,
      score, score_timestamp as "scoreTimestamp"
           FROM user_game_scores
           WHERE mp3_id = $1
           AND score = (
            SELECT MAX(score)
            FROM user_game_scores
            WHERE mp3_id = $1)`,
      [mp3_id]
    );

    const maxScore = scoreRes.rows[0];

    return maxScore;
  }


  static async getUserSongTopScore(username, mp3_id) {
    const scoreRes = await db.query(
      `SELECT id,
      score, score_timestamp as "scoreTimestamp"
           FROM user_game_scores
           WHERE mp3_id = $1
           AND username = $2
           AND score = (
            SELECT MAX(score)
            FROM user_game_scores
            WHERE mp3_id = $1
            AND username = $2)`,
      [mp3_id, username]
    );

    const maxScore = scoreRes.rows[0];

    return maxScore;
  }


  static async addScore(mp3_id, username, score) {
    const date = new Date();

    const timestamp = date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const result = await db.query(
      `INSERT INTO user_game_scores
           (mp3_id
            username,
            score,
            score_timestamp
)
       VALUES ($1, $2, $3, $4)
           RETURNING mp3_id as "mp3Id, username, score, score_timestamp as "scoreTimestamp"`,
      [
        mp3_id,
        username,
        score,
        timestamp,
      ]
    );

    const score = result.rows[0];
    return score
  }



  /** Delete given user from database; returns undefined. */

  static async removeScore(id) {
    let result = await db.query(
      `DELETE
           FROM user_game_scores
           WHERE username = $1
           RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

  /** Apply for job: update db, returns undefined.
   *
   * - username: username applying for job
   * - jobId: job id
   **/

}


module.exports = Score;

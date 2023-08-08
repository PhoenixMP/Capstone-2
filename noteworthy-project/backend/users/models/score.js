"use strict";

const { userDB } = require("../../db");
const {
  NotFoundError,
  BadRequestError
} = require("../../expressError");
const moment = require('moment');
const db = userDB;

/*Related functions for user scores. */

class Score {


  /*Find all scores.
   
   Returns [{id, mp3Id, username, score, scoreTimestamp }, ...]
   */

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



  /*Find all undefeated top scores for all songs.
 
 Returns [{id, mp3Id, username, score, scoreTimestamp }, ...]
 */
  static async findAllTopScores(order) {

    const scoreRes = await db.query(
      `SELECT u.id, u.mp3_id as "mp3Id", u.username, u.score, u.score_timestamp as "scoreTimestamp"
      FROM user_game_scores u
      JOIN (
        SELECT mp3_id, MAX(score) AS "max_score"
        FROM user_game_scores 
        GROUP BY mp3_id
      ) t ON u.mp3_id = t.mp3_id AND u.score = t.max_score`
    );

    return scoreRes.rows;
  }



  /*Find all scores for a given song.
   
   Returns [{id, username, score, scoreTimestamp }, ...]
   */


  static async findAllSongScores(mp3_id) {
    const scoreRes = await db.query(
      `SELECT id, username,
      score, score_timestamp as "scoreTimestamp"
           FROM user_game_scores
           WHERE mp3_id = $1
           ORDER BY score DESC`,
      [mp3_id]
    );
    return scoreRes.rows;
  }



  /*Find undefeated top score for a given song.
 
 Returns {id, username, score, scoreTimestamp }
 
 If no top score, returns null
 */


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

    let maxScore;
    if (scoreRes.rows[0]) {
      maxScore = scoreRes.rows[0];
    } else { maxScore = null }


    return maxScore;
  }


  /*Find the best score for each user for a given song.
 
 Returns {id, username, score, scoreTimestamp }
 
 If no scores for song, returns []
 */


  static async getSongTopScores(mp3_id) {
    const scoreRes = await db.query(
      `SELECT id, username, score, score_timestamp as "scoreTimestamp"
      FROM user_game_scores
      WHERE mp3_id = $1 AND (username, score) IN (
        SELECT username, MAX(score) AS "score"
        FROM user_game_scores
        WHERE mp3_id = $1
        GROUP BY username
      )
      ORDER BY score DESC`,
      [mp3_id]
    );

    let topScores = [];
    if (scoreRes.rows.length > 0) {
      topScores = scoreRes.rows;
    }

    return topScores;
  }



  /*Find all scores for a given user.
  
   can order by (all optional):
  - score 
  - score_timestamp
  
  Returns [{mp3ID, {scores}},...]
  where scores is [{score, scoreTimestamp}, ...]
  
  If user has no scores, returns []
  */

  static async findAllUserScores(username, order) {
    if (order !== "score" && order !== "score_timestamp") throw new BadRequestError(`Can't order by: ${order}`);

    const scoreRes = await db.query(
      `SELECT mp3_id AS "mp3Id", score, score_timestamp AS "scoreTimestamp"
      FROM user_game_scores
      WHERE username = $1
      ORDER BY mp3_id, ${order} DESC`,
      [username]
    );

    const scores = [];
    let currentMp3Id = null;
    let currentMp3Scores = [];

    for (const row of scoreRes.rows) {
      if (row.mp3Id !== currentMp3Id) {
        if (currentMp3Id !== null) {
          scores.push({ mp3Id: currentMp3Id, scores: currentMp3Scores });
        }
        currentMp3Id = row.mp3Id;
        currentMp3Scores = [];
      }
      currentMp3Scores.push({ score: row.score, scoreTimestamp: row.scoreTimestamp });
    }

    if (currentMp3Id !== null) {
      scores.push({ mp3Id: currentMp3Id, scores: currentMp3Scores });
    }

    return scores;
  }




  /*Find all top scores for a given user.

can order by (all optional):
  - score 
  - score_timestamp
  
Returns [{id, username, mp3ID, score, scoreTimestamp},...]
*/

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



  /*Find all scores for a given user and song.
  
     can order by (all optional):
    - score 
    - score_timestamp
    
  Returns [{id, username, score, scoreTimestamp},...]
  */

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



  /*Find a user's best score for a given song.

  Returns {id, score, scoreTimestamp}
    If user has no best score for song, returns null
  */


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

    let maxScore;
    if (scoreRes.rows[0]) {
      maxScore = scoreRes.rows[0];
    } else { maxScore = null }


    return maxScore;
  }


  /*Find a user's undefeated best scores (site-wide top score) .

Returns [{id, mp3Id, username, score, scoreTimestamp},...]
  If user has no best score for song, returns null
*/


  static async getUserUndefeatedTopScores(username, order) {
    if (order !== "score" && order !== "score_timestamp") throw new BadRequestError(`Can't order by: ${order}`);
    const scoreRes = await db.query(
      `SELECT u.id, u.mp3_id as "mp3Id", u.username, u.score, u.score_timestamp AS "scoreTimestamp"
      FROM user_game_scores u
      JOIN (
        SELECT mp3_id, MAX(score) AS "max_score"
        FROM user_game_scores
        GROUP BY mp3_id
      ) t ON u.mp3_id = t.mp3_id AND u.score = t.max_score
      WHERE u.username = $1
      ORDER BY ${order} DESC`,
      [username]
    );
    return scoreRes.rows;
  }



  /*Add a score.

Returns {mp3Id, username, score, scoreTimestamp}

*/

  static async addScore(mp3_id, username, score) {

    const formattedTimestamp = moment().format('MM/DD/YYYY hh:mm A');
    const result = await db.query(
      `INSERT INTO user_game_scores
           (mp3_id,
            username,
            score,
            score_timestamp
)
       VALUES ($1, $2, $3, $4)
           RETURNING mp3_id as "mp3Id", username, score, score_timestamp as "scoreTimestamp"`,
      [
        mp3_id,
        username,
        score,
        formattedTimestamp
      ]
    );

    const newScore = result.rows[0];
    return newScore
  }


  /*Delete given score from database; returns undefined. 
  
     Throws NotFoundError if score not found.
     */

  static async removeScore(id) {
    let result = await db.query(
      `DELETE
           FROM user_game_scores
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const score = result.rows[0];

    if (!score) throw new NotFoundError(`No score: ${id}}`);
  }

}


module.exports = Score;

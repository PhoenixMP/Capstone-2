import React from "react";
import { Link } from "react-router-dom";


/** Loading message used by components that fetch API data. */

function UserScoreCard({ song }) {


  return (
    <div className="ScoreCard card">
      <Link to={`/song/${song.mp3Id}`}>
        <h4 className="card-title">{song.songTitle}, {song.songDir}</h4>
      </Link>
      <div>
        {song.scores.map((score) => (

          <p><b>Score: {score.score}</b>  {score.scoreTimestamp}</p>
        )

        )}

      </div>
    </div>
  )
}

export default UserScoreCard;
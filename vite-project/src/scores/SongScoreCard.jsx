import React from "react";
import { Link } from "react-router-dom";


/** Loading message used by components that fetch API data. */

function SongScoreCard(props) {

  function checkIfTopScore() {
    if (props.isTop) {
      return (
        <div className="card-body song-score">
          <p>Top Score: {props.score}</p>
          <p>user: {props.username}</p>
          <p>{props.scoreTimestamp}</p>
        </div>
      );
    } else {
      return (
        <div className="card-body song-score">
          <p>Score: {props.score}</p>
          <p>{props.scoreTimestamp}</p>
        </div>
      );

    }
  }

  return (
    <div>
      {checkIfTopScore()}

    </div>
  );

}

export default SongScoreCard;
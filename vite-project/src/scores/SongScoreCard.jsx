import React from "react";
import { Link } from "react-router-dom";


/** Loading message used by components that fetch API data. */

function SongScoreCard(props) {


  function checkScoreType() {
    if (props.isTop && !props.userHasTop) {
      return (
        <div className="card-body song-score">
          <p><b>Top Score held by {props.username}: {props.score}</b> {props.scoreTimestamp}</p>

        </div>
      );
    } else if (props.isTop && props.userHasTop) {
      return (
        <div className="card-body song-score">
          <h4>Your Top Score is Undefeatd!</h4>
          <p><b>Top Score held by {props.username}: {props.score}</b> {props.scoreTimestamp}</p>
        </div>
      );

    } else if (props.usersBest) {
      return (
        <div className="card-body song-score">
          <p><b>Your Best Score: {props.score}</b> {props.scoreTimestamp}</p>
        </div>
      );

    } else {
      return (
        <div className="card-body song-score">
          <p><b>Score: {props.score}</b> {props.scoreTimestamp}</p>
        </div>
      );

    }
  }

  return (
    <div>
      {checkScoreType()}

    </div>
  );

}

export default SongScoreCard;
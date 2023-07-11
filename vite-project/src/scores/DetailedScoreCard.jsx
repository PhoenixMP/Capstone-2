import React from "react";
import { Link } from "react-router-dom";


/** Loading message used by components that fetch API data. */

function DetailedScoreCard(props) {

  function checkIfUser() {
    if (props.isUser) {
      return (
        <div>
          <p>Top Score: {props.score}</p>
          <p>{props.scoreTimestamp}</p>
        </div>
      )
    } else {
      return (
        <div>
          <p>Top Score: {props.score}</p>
          <p>User: {props.username}</p>
          <p>{props.scoreTimestamp}</p>
        </div>
      )
    }
  };



  return (
    <div className="card-body homepage-score">
      <Link to={`/song/${props.mp3Id}`} key={props.mp3Id}>
        <h4 className="card-title">{props.title}, {props.dir}</h4>
      </Link>
      {checkIfUser()}
    </div>
  );
}


export default DetailedScoreCard;
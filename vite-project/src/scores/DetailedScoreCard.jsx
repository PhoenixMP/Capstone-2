import React from "react";
import { Link } from "react-router-dom";


/** Loading message used by components that fetch API data. */

function DetailedScoreCard(props) {


  function checkIfUser() {
    if (props.isUser) {
      return (
        <div>
          <p><b>Top Score: {props.score}</b> {props.scoreTimestamp}</p>
        </div>
      )
    } else {
      return (
        <div>
          <p><b>Top Score: {props.score}</b> {props.scoreTimestamp}</p>
          <p>User: {props.username}</p>

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
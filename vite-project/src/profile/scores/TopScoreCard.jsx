import React from "react";
import { Link } from "react-router-dom";


/** Loading message used by components that fetch API data. */

function TopScoreCard(props) {



  return (
    <div className="card-body homepage-score">
      <Link to={`/song/${props.mp3Id}`} key={props.mp3Id}>
        <h4 className="card-title">{props.title}, {props.dir}</h4>
      </Link>
      <p><b>Top Score: {props.score}</b> {props.scoreTimestamp}</p>
    </div>
  );
}


export default TopScoreCard;
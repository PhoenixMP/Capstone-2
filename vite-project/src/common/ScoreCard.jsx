import React from "react";
import { Link } from "react-router-dom";


/** Loading message used by components that fetch API data. */

function ScoreCard(props) {

  function homepageScores() {

    return (
      <div className="card-body homepage-score">
        <Link to={`/song/${props.mp3Id}`} key={props.mp3Id}>
          <h6 className="card-title">{props.title}</h6>
          <p>{props.dir}</p>
        </Link>
        <p>{props.score}</p>
        <p>{props.username}</p>
        <p>{props.scoreTimestamp}</p>
      </div>
    );
  }


  function songUserScores() {

    return (
      <div className="card-body song-socre">
        <p>{props.score}</p>
        <p>{props.scoreTimestamp}</p>
      </div>
    );
  }

  function profileScores() {

    return (
      <div className="card-body profile-score">
        <p>{props.score}</p>
        <p>{props.scoreTimestamp}</p>
      </div>
    );
  }


  function chooseList() {
    if (!props.type) return homepageScores();
    if (props.type === 'songUserScores') return songUserScores();
    if (props.type === 'profileScores') return profileScores();
  }


  return (
    <div className="ScoreCard card">
      {chooseList()}
    </div>
  );
}

export default ScoreCard;
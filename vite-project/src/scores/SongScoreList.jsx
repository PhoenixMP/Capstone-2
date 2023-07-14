import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import SongScoreCard from "./SongScoreCard";
import LoadingSpinner from "../common/LoadingSpinner";
import Melodic2API from "../api/api";
import { Link } from "react-router-dom";




function SongScoreList({ allScores, userTopScore, userHasTop }) {

  function topScoreJSX() {
    return (<SongScoreCard
      key={userTopScore.id}
      score={userTopScore.score}
      scoreTimestamp={userTopScore.scoreTimestamp}
      usersBest={true}
    />
    )
  }


  return (
    <div> Your Past Scores:
      {userHasTop ? '' : topScoreJSX()}
      {allScores.map((score) => (
        <SongScoreCard
          key={score.id}
          score={score.score}
          scoreTimestamp={score.scoreTimestamp}
        />
      ))}
    </div>

  );


}

export default SongScoreList;
import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import SongScoreCard from "./SongScoreCard";
import LoadingSpinner from "../common/LoadingSpinner";
import Melodic2API from "../api/api";
import { Link } from "react-router-dom";




function SongScoreList({ scores }) {



  return (
    <div>

      {scores.map((score) => (
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
import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import ProfileScoreCard from "./ProfileScoreCard";

import LoadingSpinner from "../../common/LoadingSpinner";






function ProfileScoreList({ scores, undefeated }) {


  if (!scores || scores === null) return <LoadingSpinner />;



  return (
    <div className="scores-list">
      {scores.map((score, index) => (
        <ProfileScoreCard
          key={score.id}
          mp3Id={score.mp3Id}
          username={score.username}
          score={score.score}
          title={score.songTitle}
          dir={score.songDir}
          scoreTimestamp={score.scoreTimestamp}
          order={index + 1}
          cardNumber={scores.length}
          undefeated={undefeated}

        />
      ))}
    </div>
  );


}

export default ProfileScoreList;
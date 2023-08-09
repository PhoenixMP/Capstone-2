import React from "react";
import ProfileScoreCard from "./ProfileScoreCard";
import LoadingSpinner from "../../common/LoadingSpinner";



/**
 * Component to display a list of profile score cards.
 *
 * This component is responsible for rendering a list of score cards for the user's profile.
 * It maps through the provided `scores` array to create individual `ProfileScoreCard` components
 * for each score entry, displaying details such as song title, score, and more.
 *
 * If `scores` are not yet available (null), a loading spinner is displayed until the data is loaded.
 *
 * @component
 * @param {Array|boolean} scores - An array of score objects to be displayed.
 * @param {boolean} undefeated - Indicates whether the user has undefeated scores.
 * @return {JSX.Element} ProfileScoreList component
 */


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
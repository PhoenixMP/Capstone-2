import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import DetailedScoreCard from "./DetailedScoreCard";
import LoadingSpinner from "../common/LoadingSpinner";
import Melodic2API from "../api/api";





function ScoreList(props) {
  const [scoreInfo, setScoreInfo] = useState([])

  useEffect(() => {

    function compareArrays(scores, songs) {
      const scoreDetails = scores.map((score) => {
        const mp3Id = score.mp3Id;
        const matchingSong = songs.find((song) => song.mp3_id === mp3Id);
        if (matchingSong) {
          score.songTitle = matchingSong.title;
          score.songDir = matchingSong.dir
        }
        return score;
      })
      return scoreDetails;
    }


    async function getAllSongs() {
      const songs = await Melodic2API.getAllSongs();

      const scoreDetails = compareArrays(props.scores, songs)
      setScoreInfo(scoreDetails)
    }

    getAllSongs();

  }, [props.scores]);

  if (!scoreInfo || !scoreInfo === true) return <LoadingSpinner />;


  return (
    <div >
      {scoreInfo.map(score => (
        <DetailedScoreCard
          key={score.id}
          mp3Id={score.mp3Id}
          username={score.username}
          score={score.score}
          title={score.songTitle}
          dir={score.songDir}
          scoreTimestamp={score.scoreTimestamp}
          DetailedScoreCard={props.isUser}
        />
      ))}
    </div>
  );


}

export default ScoreList;
import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import UserScoreCard from "./GeneralUserScoreCard";
import LoadingSpinner from "../common/LoadingSpinner";
import Melodic2API from "../api/api";
import { Link } from "react-router-dom";




function UserScoreList({ scores }) {
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

      const scoreDetails = compareArrays(scores, songs)
      setScoreInfo(scoreDetails)
    }

    getAllSongs();

  }, [scores]);

  if (!scoreInfo || !scoreInfo === true) return <LoadingSpinner />



  return (

    <div>
      {scoreInfo.map((song) => {
        return (
          <div key={song.mp3Id}>
            <Link to={`/song/${song.mp3Id}`}>
              <h6 className="card-title">{song.title}</h6>
              <p>{song.dir}</p>
            </Link>

            {song.scores.map((score) => (
              <UserScoreCard
                key={score.id}
                score={score.Score}
                scoreTimestamp={score.scoreTimestamp}
              />
            ))}
          </div>
        );
      })}
    </div>
  );

}




export default UserScoreList;
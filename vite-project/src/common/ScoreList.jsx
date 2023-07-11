import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import ScoreCard from "./ScoreCard";
import LoadingSpinner from "../common/LoadingSpinner";
import Melodic2API from "../api/api";
import { Link } from "react-router-dom";




function ScoreList({ scores, type = false }) {
  const [scoreInfo, setScoreInfo] = useState([])

  useEffect(() => {
    if (!type || type === "profileScores") {
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
    }
  }, [scores]);

  if (!scoreInfo || !scoreInfo === true) return <LoadingSpinner />;


  function homepageScores() {

    return (
      <div >
        {scoreInfo.map(score => (
          <ScoreCard
            key={score.id}
            mp3Id={score.mp3Id}
            username={score.username}
            score={score.topScore}
            title={score.songTitle}
            dir={score.songDir}
            scoreTimestamp={score.scoreTimestamp}
          />
        ))}
      </div>
    );
  }


  function songUserScores() {

    return (
      <div >
        {scoreInfo.map(score => (
          <ScoreCard
            key={score.id}
            score={score.score}
            scoreTimestamp={score.scoreTimestamp}
            type={'songUserScores'} />
        ))}
      </div>
    );
  }

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
              <ScoreCard
                key={score.id}
                score={score.Score}
                scoreTimestamp={score.scoreTimestamp}
                type={'profileScores'}
              />
            ))}
          </div>
        );
      })}
    </div>
  );


  function chooseList() {
    if (!type) return homepageScores();
    if (type === 'songUserScores') return songUserScores();
    if (type === 'profileScores') return profileScores();
  }


  return (
    <div >
      {chooseList()}

    </div>
  );


}

export default ScoreList;
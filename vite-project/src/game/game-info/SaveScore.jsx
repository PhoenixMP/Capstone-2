import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import userContext from "../../auth/UserContext";
import Melodic2API from "../../api/api";
import GameContext from "../GameContext";




function SaveScore() {
    const { currentUser, userBestScore, topScore, setOnHoldScore, onHoldScore } = useContext(userContext);
    const { totalScore, gameOver } = useContext(GameContext)
    const { mp3Id } = useParams();
    const navigate = useNavigate();

    console.log(totalScore)
    useEffect(() => {
        if (!currentUser && (score > 0)) {
            setOnHoldScore({ mp3Id, score })
        }
    }, [gameOver])


    async function addScore() {

        await Melodic2API.saveScore({ mp3Id: `${mp3Id}`, username: currentUser.username, score: totalScore })
    }

    function handleClick() {

        addScore();
        navigate(`/song/${mp3Id}`);

    }



    return (
        <div>
            {!topScore ? "Your Score is the New Top Score!" : ""}
            {((totalScore > topScore) && (topScore > 0)) ? "You beat the top score!" : ""}
            {(currentUser && userBestScore && (totalScore < topScore) && (totalScore > userBestScore)) ? "You beat your personal best!" : ""}
            {(currentUser && !userBestScore && (totalScore < topScore)) ? "This is your first score for this song!" : ""}
            {currentUser ? <button onClick={handleClick}>Submit Score</button> : <Link to={`/login`} > Login To Save Your Scores</Link>}

        </div>

    );


}

export default SaveScore;




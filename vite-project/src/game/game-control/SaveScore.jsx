import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import userContext from "../../auth/UserContext";
import Melodic2API from "../../api/api";




function SaveScore({ score }) {
    const { currentUser, userBestScore, topScore, setOnHoldScore, onHoldScore, gameOver } = useContext(userContext);
    const { mp3Id } = useParams();
    const navigate = useNavigate();
    console.log('onHoldScore', onHoldScore)

    useEffect(() => {
        if (!currentUser && (score > 0)) {
            setOnHoldScore({ mp3Id, score })
        }
    }, [gameOver])


    async function addScore() {
        console.log
        await Melodic2API.saveScore({ mp3Id: `${mp3Id}`, username: currentUser.username, score })
    }

    function handleClick() {

        addScore();
        navigate(`/song/${mp3Id}`);

    }



    return (
        <div>
            {!topScore ? "Your Score is the New Top Score!" : ""}
            {((score > topScore) && (topScore > 0)) ? "You beat the top score!" : ""}
            {(currentUser && userBestScore && (score < topScore) && (score > userBestScore)) ? "You beat your personal best!" : ""}
            {(currentUser && !userBestScore && (score < topScore)) ? "This is your first score for this song!" : ""}
            {currentUser ? <button onClick={handleClick}>Submit Score</button> : <Link to={`/login`} > Login To Save Your Scores</Link>}

        </div>

    );


}

export default SaveScore;
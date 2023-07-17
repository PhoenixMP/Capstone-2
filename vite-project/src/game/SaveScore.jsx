import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import userContext from "../auth/UserContext";




function SaveScore({ score }) {
    const { currentUser, userBestScore, topScore, setOnHoldScore, onHoldScore, addScore, gameOver } = useContext(userContext);
    const { mp3Id } = useParams();
    const navigate = useNavigate();
    console.log('onHoldScore', onHoldScore)

    useEffect(() => {
        if (!currentUser && (score > 0)) {
            setOnHoldScore({ mp3Id, score })
        }
    }, [gameOver])


    function handleClick() {
        addScore({ mp3Id, username: currentUser.username, score })

        navigate(`/song/${mp3Id}`);

    }



    return (
        <div>
            {(score > topScore) ? "You beat the top score!" : ""}
            {(currentUser && userBestScore && (score < topScore) && (score > userBestScore)) ? "You beat your personal best!" : ""}
            {(currentUser && !userBestScore && (score < topScore)) ? "This is your first score for this song!" : ""}
            {currentUser ? <button onClick={handleClick}>Submit Score</button> : <Link to={`/login`} > Login To Save Your Scores</Link>}

        </div>

    );


}

export default SaveScore;
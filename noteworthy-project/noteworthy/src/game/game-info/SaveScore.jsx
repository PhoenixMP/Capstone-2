import React, { useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import userContext from "../../auth/UserContext";
import NoteworthyAPI from "../../api/api";
import GameContext from "../GameContext";


/**
 * Component for saving and displaying user's scores at the end of the game.
 *
 * @component
 * @return {JSX.Element} The SaveScore component JSX.
 */


function SaveScore() {
    const { currentUser, userBestScore, topScore, setOnHoldScore, onHoldScore, totalScore } = useContext(userContext);
    const { gameOver } = useContext(GameContext)
    const { mp3Id } = useParams();
    const navigate = useNavigate();


    // This useEffect handles storing the user's score temporarily if they are not logged in when the game ends.
    // It checks if the game is over and the user is not logged in, then stores their score and song ID for later submission.
    useEffect(() => {
        if (!currentUser && (score > 0)) {
            setOnHoldScore({ mp3Id, score })
        }
    }, [gameOver])

    /**
     * Adds the user's score to the database.
     * @returns {Promise<void>} A promise indicating the completion of the score submission.
     */
    async function addScore() {
        await NoteworthyAPI.saveScore({ mp3Id: `${mp3Id}`, username: currentUser.username, score: totalScore })
    }


    /**
 * Handles the click event for submitting the score.
 * Navigates to the song page after submitting.
 */
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




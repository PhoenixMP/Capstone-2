import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import userContext from "../auth/UserContext";




function ScoreDisplay() {
    const { currentUser, userBestScore, topScore } = useContext(userContext);
    const [username, setUsername] = useState(null)




    function noTopScore() {
        return (
            <div>No Top Score Yet!</div>
        )
    }

    function noCurrentUser() {
        return (
            <div>Top score held by {topScore.username}: {topScore.score}</div>
        )
    }

    function userHasTopScore() {
        return (
            <div>You hold the current top score: {topScore.score}</div>
        )
    }

    function highScoreNotUsers() {
        return (
            <div>
                <div>Top score held by {topScore.username}: {topScore.score}</div>
                <div>Your Best Score: {userBestScore.score}</div>
            </div>
        )
    }
    function newGameForUser() {
        return (
            <div>
                <div>Top score held by {topScore.username}: {topScore.score}</div>
                <div>You haven't recorded any scores yet</div>
            </div>
        )
    }



    return (
        <div>
            {!topScore ? noTopScore() : ""}
            {(!currentUser && topScore) ? noCurrentUser() : ""}
            {(currentUser && currentUser.username === topScore.username) ? userHasTopScore() : ""}
            {(currentUser && topScore && userBestScore && (currentUser.username !== topScore.username)) ? highScoreNotUsers() : ""}
            {(currentUser && topScore && !userBestScore) ? newGameForUser() : ""}
        </div>

    );


}

export default ScoreDisplay;
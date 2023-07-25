import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import userContext from "../../auth/UserContext";




function GameBanner() {
    const { currentUser, userBestScore, topScore } = useContext(userContext);
    const [username, setUsername] = useState(null)





    return (
        <div className="game-banner">
            <div id="game-song-name">{song.title}, {song.dir}</div>
            {!gameOver
                ? (<LiveStats multiplier={streakMultiplier} score={totalScore} streakCount={streakCount} songLength={songLength} songProgress={songProgress} />)
                : (<GameOver score={totalScore} maxStreak={maxStreak} />)}
            {(!gameOver && !isAnimationStarted) ? (<div ClassName="get-ready-alert"><b>Get Ready!</b></div>) : (<div id="game-timer">Time Left: {Math.floor(songLength - (songProgress * songLength))}</div>)}
            <GameButtons handleStartAnimation={handleStartAnimation} isAnimationStarted={isAnimationStarted} handleStopAnimation={handleStopAnimation} />

        </div>

        </div >

    );


}

export default GameBanner;
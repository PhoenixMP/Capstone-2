import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import GeneralSoreDisplay from "./GeneralScoreDisplay"



function LiveStats({ multiplier, score, streakCount, songLength, songProgress }) {
    return (
        <div >
            <GeneralSoreDisplay />
            <div>Score:{score}</div>
            <div>Streak:{streakCount}</div>
            <div>Multiplier:x{multiplier}</div>
            <div>Time Left: {Math.floor(songLength - (songProgress * songLength))}</div>

        </div>
    )

};
export default LiveStats;
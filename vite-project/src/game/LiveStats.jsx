import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import GeneralSoreDisplay from "./GeneralScoreDisplay"



function LiveStats({ multiplier, score, streakCount, songLength, songProgress }) {
    return (
        <div className="live-stats" >
            <GeneralSoreDisplay />

            <div>Streak:{streakCount}</div>
            <div>Multiplier:x{multiplier}</div>
            <div>Score:{score}</div>


        </div>
    )

};
export default LiveStats;
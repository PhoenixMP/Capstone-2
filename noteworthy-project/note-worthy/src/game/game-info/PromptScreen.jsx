import React, { useState, useContext, useEffect } from 'react';
import GameContext from "../GameContext";
import UserContext from "../../auth/UserContext"


const PromptScreen = () => {

    const { totalScore } = useContext(GameContext);
    const { userBestScore, setUserBeatPersonalBest, topScore, setUserBeatTop, userBeatTop } = useContext(UserContext)





    return (
        <>

        </>
    );
};

export default PromptScreen;
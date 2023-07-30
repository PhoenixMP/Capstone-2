import React, { useState, useContext, useEffect } from 'react';
import keyboardImage from "../../images/keyboard.png"




const GameExplain = ({ handleRemoveExplain }) => {



    return (



        <div className="game-explain-container">
            <div className="game-explain-text">
                Welcome to the piano version of GuitarHero!

                <br />Play by pressing the corresponding key on your keyboard.
                <br />Time your keystrokes when the descending note reaches the piano.
                <br />Press too early or too late, and points will be missed!
                <button className="game-explain-button" onClick={handleRemoveExplain}>Got it!</button>
            </div>
            <div className="game-explain-right">
                <img className="keyboard-image" src={keyboardImage} />

            </div>

        </div>

    );
};

export default GameExplain;
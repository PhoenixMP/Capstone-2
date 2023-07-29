import React, { useState, useContext, useEffect } from 'react';
import GameContext from "../GameContext";
import UserContext from "../../auth/UserContext"
import GamePlayButtons from "./GamePlayButtons"
import './PopUpConfirm.css'


const PopUpConfirm = ({ message, handleYes, handleNo }) => {



    return (


        <div className="pop-up-wrapper" id="pop-up">
            <div className="pop-up-body">
                <div className="pop-up-header">
                    <h2 className="pop-up-heading">{message}</h2>
                </div>
                <div className="switch">
                    <button className="pop-up-yes-button pop-up-button" onClick={handleYes}>Yes</button>
                    <button className="pop-up-no-button pop-up-button" onClick={handleNo}>No</button>

                </div>
            </div>
        </div>

    );
};

export default PopUpConfirm;
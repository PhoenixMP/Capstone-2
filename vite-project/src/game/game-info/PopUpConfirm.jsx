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
                    <h2 className="heading">{message}</h2>
                </div>
                <div className="switch">
                    <button onClick={handleYes}>Yes</button>
                    <button onClick={handleNo}>No</button>

                </div>
            </div>
        </div>

    );
};

export default PopUpConfirm;
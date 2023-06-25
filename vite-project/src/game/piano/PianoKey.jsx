import React, { useContext, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import gameContext from "../gameContext";
import "../Game.css"



function PianoKey({ id, className, children, letter, active, pressKey, releaseKey }) {


    useEffect(() => {
        const handleKeyDownEvent = (event) => {
            if (event.key === letter) {
                console.log(`${letter} down`)
                releaseKey(letter);

            }
        };
        const handleKeyUpEvent = (event) => {
            if (event.key === letter) {
                console.log(`${letter} down`)
                pressKey(letter);

            }
        };

        window.addEventListener('keydown', handleKeyDownEvent);
        window.addEventListener('keyup', handleKeyUpEvent);

        return () => {
            window.removeEventListener('keydown', handleKeyDownEvent);
            window.removeEventListener('keyup', handleKeyUpEvent);
        };
    }, [letter, pressKey, releaseKey]);


    return (
        <li id={id} className={`${className}${active ? ':active' : ''}`}>{children}</li>
    );
}

export default PianoKey;

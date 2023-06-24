import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import "../Game.css"



function PianoKey({ id, className, children }) {


    return (
        <li id={id} className={className}>{children}</li>
    );
}

export default PianoKey;

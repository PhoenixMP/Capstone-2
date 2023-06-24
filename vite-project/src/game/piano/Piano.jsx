import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import PianoKey from "./PianoKey";



function Piano() {


    return (
        <ul className="piano">
            <PianoKey id='C' className="key white " > A</PianoKey>
            <PianoKey id='CS' className="key black " >W</PianoKey>
            <PianoKey id='D' className="key white" >S</PianoKey>
            <PianoKey id='DS' className="key black" >E</PianoKey>
            <PianoKey id='E' className="key white" >D</PianoKey>
            <PianoKey id='F' className="key white" >F</PianoKey>
            <PianoKey id='FS' className="key black" >T</PianoKey>
            <PianoKey id='G' className="key white" >G</PianoKey>
            <PianoKey id='GS' className="key black" >Y</PianoKey>
            <PianoKey id='A' className="key white" >H</PianoKey>
            <PianoKey id='AS' className="key black" >U</PianoKey>
            <PianoKey id='B' className="key white" >J</PianoKey>
        </ul>
    );
}

export default Piano;

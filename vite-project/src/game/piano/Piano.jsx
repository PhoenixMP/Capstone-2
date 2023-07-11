import React, { useContext, useState, useRef } from "react";

import PianoKey from "./PianoKey";
import gameContext from "../GameContext";

const BASE_URL = window.location.origin;
import noteC from './notes-mp3/note_C.mp3';
import noteCS from './notes-mp3/note_CS.mp3';
import noteD from './notes-mp3/note_D.mp3';
import noteDS from './notes-mp3/note_DS.mp3';
import noteE from './notes-mp3/note_E.mp3';
import noteF from './notes-mp3/note_F.mp3';
import noteFS from './notes-mp3/note_FS.mp3';
import noteG from './notes-mp3/note_G.mp3';
import noteGS from './notes-mp3/note_GS.mp3';
import noteA from './notes-mp3/note_A.mp3';
import noteAS from './notes-mp3/note_AS.mp3';
import noteB from './notes-mp3/note_B.mp3';









function Piano() {





    return (
        <ul className="piano">
            <PianoKey note={noteC} id='C' letter="A" className="key white" > A</PianoKey>
            <PianoKey note={noteCS} id='CS' letter="W" className="key black" >W</PianoKey>
            <PianoKey note={noteD} id='D' letter="S" className="key white" >S</PianoKey>
            <PianoKey note={noteDS} id='DS' letter="E" className="key black" >E</PianoKey>
            <PianoKey note={noteE} id='E' letter="D" className="key white" >D</PianoKey>
            <PianoKey note={noteF} id='F' letter="F" className="key white" >F</PianoKey>
            <PianoKey note={noteFS} id='FS' letter="T" className="key black" >T</PianoKey>
            <PianoKey note={noteG} id='G' letter="G" className="key white" >G</PianoKey>
            <PianoKey note={noteGS} id='GS' letter="Y" className="key black" >Y</PianoKey>
            <PianoKey note={noteA} id='A' letter="H" className="key white" >H</PianoKey>
            <PianoKey note={noteAS} id='AS' letter="U" className="key black" >U</PianoKey>
            <PianoKey note={noteB} id='B' letter="J" className="key white" >J</PianoKey>

        </ul>
    );
}





export default Piano;

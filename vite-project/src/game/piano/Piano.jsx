import React, { useContext, useState, useRef } from "react";

import PianoKey from "./PianoKey";
import gameContext from "../gameContext";

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



    const [keyAActive, setKeyAActive] = useState(false);
    const [keyWActive, setKeyWActive] = useState(false);
    const [keySActive, setKeySActive] = useState(false);
    const [keyEActive, setKeyEActive] = useState(false);
    const [keyDActive, setKeyDActive] = useState(false);
    const [keyFActive, setKeyFActive] = useState(false);
    const [keyTActive, setKeyTActive] = useState(false);
    const [keyGActive, setKeyGActive] = useState(false);
    const [keyYActive, setKeyYActive] = useState(false);
    const [keyHActive, setKeyHActive] = useState(false);
    const [keyUActive, setKeyUActive] = useState(false);
    const [keyJActive, setKeyJActive] = useState(false);

    const pressKey = (key) => {
        switch (key) {
            case 'A':
                setKeyAActive(true);
                break;
            case 'W':
                setKeyWActive(true);
                break;
            case 'S':
                setKeySActive(true);
                break;
            case 'E':
                setKeyEActive(true);
                break;
            case 'D':
                setKeyDActive(true);
                break;
            case 'F':
                setKeyFActive(true);
                break;
            case 'T':
                setKeyTActive(true);
                break;
            case 'G':
                setKeyGActive(true);
                break;
            case 'Y':
                setKeyYActive(true);
                break;
            case 'H':
                setKeyHActive(true);
                break;
            case 'U':
                setKeyUActive(true);
                break;
            case 'J':
                setKeyJActive(true);
                break;
            default:
                break;
        }
    };

    const releaseKey = (key) => {
        switch (key) {
            case 'A':
                setKeyAActive(false);
                break;
            case 'W':
                setKeyWActive(false);
                break;
            case 'S':
                setKeySActive(false);
                break;
            case 'E':
                setKeyEActive(false);
                break;
            case 'D':
                setKeyDActive(false);
                break;
            case 'F':
                setKeyFActive(false);
                break;
            case 'T':
                setKeyTActive(false);
                break;
            case 'G':
                setKeyGActive(false);
                break;
            case 'Y':
                setKeyYActive(false);
                break;
            case 'H':
                setKeyHActive(false);
                break;
            case 'U':
                setKeyUActive(false);
                break;
            case 'J':
                setKeyJActive(false);
                break;
            default:
                break;
        }
    };



    return (
        <ul className="piano">
            <PianoKey note={noteC} id='C' letter="A" pressKey={pressKey} releaseKey={releaseKey} active={keyAActive} className="key white" > A</PianoKey>
            <PianoKey note={noteCS} id='CS' letter="W" pressKey={pressKey} releaseKey={releaseKey} active={keyWActive} className="key black" >W</PianoKey>
            <PianoKey note={noteD} id='D' letter="S" pressKey={pressKey} releaseKey={releaseKey} active={keySActive} className="key white" >S</PianoKey>
            <PianoKey note={noteDS} id='DS' letter="E" pressKey={pressKey} releaseKey={releaseKey} active={keyEActive} className="key black" >E</PianoKey>
            <PianoKey note={noteE} id='E' letter="D" pressKey={pressKey} releaseKey={releaseKey} active={keyDActive} className="key white" >D</PianoKey>
            <PianoKey note={noteF} id='F' letter="F" pressKey={pressKey} releaseKey={releaseKey} active={keyFActive} className="key white" >F</PianoKey>
            <PianoKey note={noteFS} id='FS' letter="T" pressKey={pressKey} releaseKey={releaseKey} active={keyTActive} className="key black" >T</PianoKey>
            <PianoKey note={noteG} id='G' letter="G" pressKey={pressKey} releaseKey={releaseKey} active={keyGActive} className="key white" >G</PianoKey>
            <PianoKey note={noteGS} id='GS' letter="Y" pressKey={pressKey} releaseKey={releaseKey} active={keyYActive} className="key black" >Y</PianoKey>
            <PianoKey note={noteA} id='A' letter="H" pressKey={pressKey} releaseKey={releaseKey} active={keyHActive} className="key white" >H</PianoKey>
            <PianoKey note={noteAS} id='AS' letter="U" pressKey={pressKey} releaseKey={releaseKey} active={keyUActive} className="key black" >U</PianoKey>
            <PianoKey note={noteB} id='B' letter="J" pressKey={pressKey} releaseKey={releaseKey} active={keyJActive} className="key white" >J</PianoKey>

        </ul>
    );
}





export default Piano;

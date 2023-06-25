import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import PianoKey from "./PianoKey";
import gameContext from "../gameContext";



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




    const releaseKey = (key) => {
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

    const pressKey = (key) => {
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
            <PianoKey letter="A" releaseKey={releaseKey} active={keyAActive} pressKey={pressKey} id='C' className="key white" > A</PianoKey>
            <PianoKey letter="W" releaseKey={releaseKey} active={keyWActive} pressKey={pressKey} id='CS' className="key black " >W</PianoKey>
            <PianoKey letter="S" releaseKey={releaseKey} active={keySActive} pressKey={pressKey} id='D' className="key white" >S</PianoKey>
            <PianoKey letter="E" releaseKey={releaseKey} active={keyEActive} pressKey={pressKey} id='DS' className="key black" >E</PianoKey>
            <PianoKey letter="D" releaseKey={releaseKey} active={keyDActive} pressKey={pressKey} id='E' className="key white" >D</PianoKey>
            <PianoKey letter="F" releaseKey={releaseKey} active={keyFActive} pressKey={pressKey} id='F' className="key white" >F</PianoKey>
            <PianoKey letter="T" releaseKey={releaseKey} active={keyTActive} pressKey={pressKey} id='FS' className="key black" >T</PianoKey>
            <PianoKey letter="G" releaseKey={releaseKey} active={keyGActive} pressKey={pressKey} id='G' className="key white" >G</PianoKey>
            <PianoKey letter="Y" releaseKey={releaseKey} active={keyYActive} pressKey={pressKey} id='GS' className="key black" >Y</PianoKey>
            <PianoKey letter="H" releaseKey={releaseKey} active={keyHActive} pressKey={pressKey} id='A' className="key white" >H</PianoKey>
            <PianoKey letter="U" releaseKey={releaseKey} active={keyUActive} pressKey={pressKey} id='AS' className="key black" >U</PianoKey>
            <PianoKey letter="J" releaseKey={releaseKey} active={keyJActive} pressKey={pressKey} id='B' className="key white" >J</PianoKey>
        </ul>
    );
}





export default Piano;

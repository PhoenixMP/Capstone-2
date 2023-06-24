import React, { useState, useEffect, useContext } from 'react';
import base64 from 'react-native-base64'
import MidiPlayer from 'react-midi-player';
import musicContext from "../musicContext";
import LoadingSpinner from "../../common/LoadingSpinner";





function MidiPlayerComponent({ trackName, fullSong }) {
    const { song } = useContext(musicContext);


    let encodedData;

    const encodedMidiData = song.midiData;
    if (fullSong) {
        encodedData = encodedMidiData.encodedSong.encodedSong;
    } else {
        const idx = encodedMidiData.encodedTracks.findIndex(obj => obj.trackName === trackName);
        encodedData = encodedMidiData.encodedTracks[idx].encodedData;
    }
    const decodedData = base64.decode(encodedData);

    if (!decodedData) return <LoadingSpinner />;


    return (
        <div>
            <MidiPlayer data={decodedData} />
        </div >

    );
};



export default MidiPlayerComponent;


{/* <div>
<button onClick={startPlayback}>Start</button>
<button onClick={stopPlayback}>Stop</button>
</div> */}
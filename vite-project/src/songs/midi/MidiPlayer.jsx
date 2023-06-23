import React, { useState, useEffect, useRef } from 'react';
import base64 from 'react-native-base64'
import MidiPlayer from 'react-midi-player';





function MidiPlayerComponent({ trackName, encodedMidiData, fullSong }) {
    const [midiData, setMidiData] = useState(null);
    console.log(encodedMidiData)


    useEffect(() => {
        let encodedData;
        if (fullSong) {
            encodedData = encodedMidiData.encodedSong.encodedSong
        } else {
            const idx = encodedMidiData.encodedTracks.findIndex(obj => obj.trackName === trackName);
            encodedData = encodedMidiData.encodedTracks[idx].encodedData
        }

        const decodedData = base64.decode(encodedData)// Decode the Base64-encoded MIDI data
        setMidiData(decodedData);


    }, [trackName, fullSong]);




    return (
        <div>
            <MidiPlayer data={midiData} />
        </div >

    );
};



export default MidiPlayerComponent;


{/* <div>
<button onClick={startPlayback}>Start</button>
<button onClick={stopPlayback}>Stop</button>
</div> */}
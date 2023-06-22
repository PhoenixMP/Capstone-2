import React, { useState, useEffect, useRef } from 'react';
import base64 from 'react-native-base64'
import MidiPlayer from 'react-midi-player';





function MidiPlayerComponent({ trackName, EncodedMidiData, fullSong }) {
    const [midiData, setMidiData] = useState(null);


    useEffect(() => {
        let encodedData;
        if (fullSong) {
            encodedData = EncodedMidiData.encodedSong.encodedSong
        } else {
            const idx = EncodedMidiData.encodedTracks.findIndex(obj => obj.trackName === trackName);
            encodedData = EncodedMidiData.encodedTracks[idx].encodedData
        }

        const decodedData = base64.decode(encodedData)// Decode the Base64-encoded MIDI data
        console.log(`decodedData:${decodedData}`)

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
import { useState, useEffect } from 'react';
import { useSound } from 'use-sound';

/**
 * Custom React hook to play binary audio data using the Web Audio API.
 *
 * @param {ArrayBuffer} binaryData - Binary audio data to be played.
 * @returns {Object} - An object containing play and stop functions.
 */

const useBinarySound = (binaryData) => {
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [play, { stop }] = useSound(audioBuffer);

  // Effect to decode the binary audio data into an audio buffer
  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContext.decodeAudioData(binaryData, (buffer) => {
      setAudioBuffer(buffer);
    });
  }, [binaryData]);

  return { play, stop };
};

export default useBinarySound;

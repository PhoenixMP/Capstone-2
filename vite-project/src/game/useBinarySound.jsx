import { useState, useEffect } from 'react';
import { useSound } from 'use-sound';

const useBinarySound = (binaryData) => {
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [play, { stop }] = useSound(audioBuffer);

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContext.decodeAudioData(binaryData, (buffer) => {
      setAudioBuffer(buffer);
    });
  }, [binaryData]);

  return { play, stop };
};

export default useBinarySound;

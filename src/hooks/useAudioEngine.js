import { useRef, useCallback, useEffect } from 'react';

// Generate drum sounds using Web Audio API synthesis
const generateDrumSound = (audioContext, type) => {
  const sampleRate = audioContext.sampleRate;
  const duration = type === 'bass' ? 0.5 : type === 'ride' ? 0.8 : 0.3;
  const length = sampleRate * duration;
  const buffer = audioContext.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  switch (type) {
    case 'bass': {
      // Bass drum: low frequency sine with pitch decay
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const freq = 150 * Math.exp(-t * 10);
        const env = Math.exp(-t * 8);
        data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.8;
      }
      break;
    }
    case 'snare': {
      // Snare: noise + tone
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const noise = (Math.random() * 2 - 1) * Math.exp(-t * 15);
        const tone = Math.sin(2 * Math.PI * 200 * t) * Math.exp(-t * 20);
        data[i] = (noise * 0.6 + tone * 0.4) * 0.7;
      }
      break;
    }
    case 'hihat':
    case 'hihat-left': {
      // Hi-hat: high frequency noise
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const noise = (Math.random() * 2 - 1);
        const env = Math.exp(-t * 30);
        data[i] = noise * env * 0.4;
      }
      break;
    }
    case 'tom': {
      // Tom: mid frequency with pitch decay
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const freq = 200 * Math.exp(-t * 5);
        const env = Math.exp(-t * 12);
        data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.7;
      }
      break;
    }
    case 'floor-tom': {
      // Floor tom: lower frequency tom
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const freq = 100 * Math.exp(-t * 4);
        const env = Math.exp(-t * 10);
        data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.75;
      }
      break;
    }
    case 'ride': {
      // Ride cymbal: complex harmonics with slow decay
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const noise = (Math.random() * 2 - 1) * 0.3;
        const tone1 = Math.sin(2 * Math.PI * 350 * t) * 0.3;
        const tone2 = Math.sin(2 * Math.PI * 800 * t) * 0.2;
        const tone3 = Math.sin(2 * Math.PI * 1200 * t) * 0.1;
        const env = Math.exp(-t * 5);
        data[i] = (noise + tone1 + tone2 + tone3) * env * 0.5;
      }
      break;
    }
    default: {
      // Default click
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        data[i] = Math.sin(2 * Math.PI * 440 * t) * Math.exp(-t * 20) * 0.5;
      }
    }
  }

  return buffer;
};

export const useAudioEngine = () => {
  const audioContextRef = useRef(null);
  const samplesRef = useRef({});
  const isInitializedRef = useRef(false);

  const initAudio = useCallback(async () => {
    if (isInitializedRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

      // Generate all drum sounds
      const drumTypes = ['bass', 'snare', 'hihat', 'hihat-left', 'tom', 'floor-tom', 'ride'];

      drumTypes.forEach(type => {
        samplesRef.current[type] = generateDrumSound(audioContextRef.current, type);
      });

      isInitializedRef.current = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }, []);

  const playSound = useCallback((trackId) => {
    if (!audioContextRef.current || !samplesRef.current[trackId]) {
      return;
    }

    // Resume context if suspended (browser autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const source = audioContextRef.current.createBufferSource();
    const gainNode = audioContextRef.current.createGain();

    source.buffer = samplesRef.current[trackId];
    source.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    gainNode.gain.setValueAtTime(1, audioContextRef.current.currentTime);
    source.start(0);
  }, []);

  const playStep = useCallback((pattern, step) => {
    Object.keys(pattern).forEach(trackId => {
      if (pattern[trackId][step]) {
        playSound(trackId);
      }
    });
  }, [playSound]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    initAudio,
    playSound,
    playStep,
    isInitialized: isInitializedRef.current
  };
};

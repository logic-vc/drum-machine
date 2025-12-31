import { useRef, useCallback, useEffect } from 'react';

// Create more realistic drum sounds using advanced synthesis
const generateDrumSound = (audioContext, type) => {
  const sampleRate = audioContext.sampleRate;

  // Different durations for different drums
  const durations = {
    'bass': 0.8,
    'snare': 0.4,
    'hihat': 0.15,
    'hihat-left': 0.12,
    'tom': 0.5,
    'floor-tom': 0.7,
    'ride': 1.2
  };

  const duration = durations[type] || 0.3;
  const length = Math.floor(sampleRate * duration);
  const buffer = audioContext.createBuffer(2, length, sampleRate); // Stereo
  const dataL = buffer.getChannelData(0);
  const dataR = buffer.getChannelData(1);

  switch (type) {
    case 'bass': {
      // Realistic bass drum: layered sine waves with pitch drop + click transient
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;

        // Initial click transient
        const click = Math.exp(-t * 90) * Math.sin(2 * Math.PI * 1200 * t) * 0.3;

        // Main body - pitch drops from ~150Hz to ~50Hz
        const pitchEnv = 150 * Math.exp(-t * 12) + 55;
        const bodyEnv = Math.exp(-t * 5);
        const body = Math.sin(2 * Math.PI * pitchEnv * t) * bodyEnv;

        // Sub bass layer
        const sub = Math.sin(2 * Math.PI * 50 * t) * Math.exp(-t * 3.5) * 0.5;

        // Punch layer
        const punch = Math.sin(2 * Math.PI * 100 * t) * Math.exp(-t * 15) * 0.4;

        // Combine with slight compression effect
        let sample = (click + body * 0.8 + sub + punch) * 0.65;
        sample = Math.tanh(sample * 1.8); // Soft saturation

        dataL[i] = sample;
        dataR[i] = sample;
      }
      break;
    }

    case 'snare': {
      // Realistic snare: body tone + snare wires (filtered noise) + attack transient
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;

        // Attack transient - sharp stick hit
        const attack = Math.exp(-t * 150) * 0.6;

        // Body tone - fundamental and harmonic
        const tone1 = Math.sin(2 * Math.PI * 180 * t) * Math.exp(-t * 20);
        const tone2 = Math.sin(2 * Math.PI * 330 * t) * Math.exp(-t * 25) * 0.5;
        const tone3 = Math.sin(2 * Math.PI * 250 * t) * Math.exp(-t * 22) * 0.3;

        // Snare wires - noise with envelope
        const noise = (Math.random() * 2 - 1);
        const wireEnv = Math.exp(-t * 10);
        const wire = noise * wireEnv * 0.55;

        // Shell ring
        const ring = Math.sin(2 * Math.PI * 500 * t) * Math.exp(-t * 35) * 0.15;

        let sample = attack + (tone1 + tone2 + tone3) * 0.35 + wire + ring;
        sample = Math.tanh(sample * 1.4) * 0.7;

        dataL[i] = sample;
        dataR[i] = sample;
      }
      break;
    }

    case 'hihat':
    case 'hihat-left': {
      // Realistic hi-hat: metallic noise with resonant peaks
      const isLeft = type === 'hihat-left';
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;

        // Multiple metallic frequencies (inharmonic like real cymbals)
        const freq1 = 4200 + Math.sin(t * 40) * 80;
        const freq2 = 6800;
        const freq3 = 9500;
        const freq4 = 12000;

        const metal1 = Math.sin(2 * Math.PI * freq1 * t) * 0.25;
        const metal2 = Math.sin(2 * Math.PI * freq2 * t) * 0.2;
        const metal3 = Math.sin(2 * Math.PI * freq3 * t) * 0.15;
        const metal4 = Math.sin(2 * Math.PI * freq4 * t) * 0.1;

        // Noise component - band limited feel
        const noise = (Math.random() * 2 - 1) * 0.35;

        // Sharp envelope for closed hi-hat
        const env = Math.exp(-t * 50);

        let sample = (metal1 + metal2 + metal3 + metal4 + noise) * env * 0.45;

        // Stereo positioning
        dataL[i] = sample * (isLeft ? 1.0 : 0.65);
        dataR[i] = sample * (isLeft ? 0.65 : 1.0);
      }
      break;
    }

    case 'tom': {
      // Realistic rack tom
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;

        // Attack stick hit
        const attack = Math.exp(-t * 70) * 0.5;

        // Body with pitch drop (220Hz -> 165Hz)
        const pitch = 220 * Math.exp(-t * 6) + 165;
        const body = Math.sin(2 * Math.PI * pitch * t);
        const bodyEnv = Math.exp(-t * 7);

        // Overtone
        const overtone = Math.sin(2 * Math.PI * pitch * 1.6 * t) * 0.25 * Math.exp(-t * 10);

        // Head resonance
        const resonance = Math.sin(2 * Math.PI * pitch * 2.2 * t) * 0.1 * Math.exp(-t * 15);

        // Shell resonance
        const shell = (Math.random() * 2 - 1) * Math.exp(-t * 25) * 0.08;

        let sample = attack + (body + overtone + resonance) * bodyEnv * 0.55 + shell;
        sample = Math.tanh(sample * 1.3) * 0.65;

        // Slight stereo - pan left
        dataL[i] = sample;
        dataR[i] = sample * 0.85;
      }
      break;
    }

    case 'floor-tom': {
      // Realistic floor tom - deeper and longer
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;

        // Attack
        const attack = Math.exp(-t * 50) * 0.5;

        // Body with pitch drop (130Hz -> 80Hz)
        const pitch = 130 * Math.exp(-t * 4) + 80;
        const body = Math.sin(2 * Math.PI * pitch * t);
        const bodyEnv = Math.exp(-t * 4.5);

        // Sub layer
        const sub = Math.sin(2 * Math.PI * 55 * t) * Math.exp(-t * 3) * 0.35;

        // Overtone
        const overtone = Math.sin(2 * Math.PI * pitch * 1.5 * t) * 0.2 * Math.exp(-t * 6);

        // Shell resonance
        const shell = (Math.random() * 2 - 1) * Math.exp(-t * 18) * 0.08;

        let sample = attack + (body + overtone) * bodyEnv * 0.55 + sub + shell;
        sample = Math.tanh(sample * 1.3) * 0.7;

        // Stereo - pan right
        dataL[i] = sample * 0.8;
        dataR[i] = sample;
      }
      break;
    }

    case 'ride': {
      // Realistic ride cymbal - complex metallic sound with long decay
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;

        // Bell/ping attack
        const ping = Math.sin(2 * Math.PI * 2800 * t) * Math.exp(-t * 25) * 0.35;
        const ping2 = Math.sin(2 * Math.PI * 5600 * t) * Math.exp(-t * 40) * 0.15;

        // Main body - multiple inharmonic frequencies (typical of cymbals)
        const f1 = Math.sin(2 * Math.PI * 320 * t);
        const f2 = Math.sin(2 * Math.PI * 590 * t) * 0.7;
        const f3 = Math.sin(2 * Math.PI * 985 * t) * 0.5;
        const f4 = Math.sin(2 * Math.PI * 1450 * t) * 0.35;
        const f5 = Math.sin(2 * Math.PI * 2200 * t) * 0.25;
        const f6 = Math.sin(2 * Math.PI * 3400 * t) * 0.15;

        // Noise wash
        const noise = (Math.random() * 2 - 1) * 0.2;

        // Two-stage envelope
        const env1 = Math.exp(-t * 6);   // Body
        const env2 = Math.exp(-t * 2);   // Sustain
        const env = env1 * 0.6 + env2 * 0.4;

        let sample = ping + ping2 + (f1 + f2 + f3 + f4 + f5 + f6 + noise) * env * 0.3;
        sample = Math.tanh(sample * 1.2) * 0.5;

        // Stereo spread - pan right
        dataL[i] = sample * 0.75;
        dataR[i] = sample;
      }
      break;
    }

    default: {
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        dataL[i] = Math.sin(2 * Math.PI * 440 * t) * Math.exp(-t * 20) * 0.5;
        dataR[i] = dataL[i];
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

    gainNode.gain.setValueAtTime(0.85, audioContextRef.current.currentTime);
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

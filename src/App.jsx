import { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import Sequencer from './components/Sequencer';
import { useAudioEngine } from './hooks/useAudioEngine';

// Initial empty pattern for all 7 tracks
const createEmptyPattern = () => ({
  'hihat-left': Array(16).fill(false),
  'tom': Array(16).fill(false),
  'floor-tom': Array(16).fill(false),
  'ride': Array(16).fill(false),
  'hihat': Array(16).fill(false),
  'snare': Array(16).fill(false),
  'bass': Array(16).fill(false),
});

// Default demo pattern
const createDemoPattern = () => ({
  'hihat-left': [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  'tom': [false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false],
  'floor-tom': [false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false],
  'ride': [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
  'hihat': [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
  'snare': [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
  'bass': [true, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false],
});

function App() {
  const [pattern, setPattern] = useState(createDemoPattern);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [bpm, setBpm] = useState(90);
  const [audioInitialized, setAudioInitialized] = useState(false);

  const { initAudio, playSound, playStep } = useAudioEngine();
  const intervalRef = useRef(null);
  const patternRef = useRef(pattern);

  // Keep patternRef in sync with pattern state
  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

  // Initialize audio on first user interaction
  const ensureAudioInitialized = useCallback(async () => {
    if (!audioInitialized) {
      await initAudio();
      setAudioInitialized(true);
    }
  }, [audioInitialized, initAudio]);

  // Toggle pad and play preview sound
  const handleTogglePad = useCallback(async (trackId, stepIndex) => {
    await ensureAudioInitialized();

    setPattern(prev => ({
      ...prev,
      [trackId]: prev[trackId].map((val, i) => (i === stepIndex ? !val : val)),
    }));

    // Play preview sound when activating a pad
    playSound(trackId);
  }, [ensureAudioInitialized, playSound]);

  // Play/Stop toggle
  const handlePlayToggle = useCallback(async () => {
    await ensureAudioInitialized();

    if (isPlaying) {
      // Stop
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
      setCurrentStep(-1);
    } else {
      // Start
      setIsPlaying(true);
      setCurrentStep(0);

      // Play first step immediately
      playStep(patternRef.current, 0);

      const intervalMs = (60 / bpm) * 1000 / 4; // 16th note interval

      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          const next = (prev + 1) % 16;
          playStep(patternRef.current, next);
          return next;
        });
      }, intervalMs);
    }
  }, [isPlaying, bpm, ensureAudioInitialized, playStep]);

  // Update interval when BPM changes while playing
  useEffect(() => {
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);

      const intervalMs = (60 / bpm) * 1000 / 4;

      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          const next = (prev + 1) % 16;
          playStep(patternRef.current, next);
          return next;
        });
      }, intervalMs);
    }
  }, [bpm, isPlaying, playStep]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Reset pattern
  const handleReset = useCallback(() => {
    setPattern(createEmptyPattern());
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
      setCurrentStep(-1);
    }
  }, [isPlaying]);

  // BPM change handler
  const handleBpmChange = useCallback((newBpm) => {
    setBpm(newBpm);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        handlePlayToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayToggle]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-6 px-4 sm:py-10 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Header />

        <div className="space-y-4 sm:space-y-6">
          <Controls
            isPlaying={isPlaying}
            bpm={bpm}
            onPlayToggle={handlePlayToggle}
            onReset={handleReset}
            onBpmChange={handleBpmChange}
          />

          <Sequencer
            pattern={pattern}
            currentStep={currentStep}
            isPlaying={isPlaying}
            onTogglePad={handleTogglePad}
          />
        </div>

        {/* Footer hint */}
        <footer className="text-center mt-6 sm:mt-8 text-gray-600 text-xs">
          Press <kbd className="px-1.5 py-0.5 bg-[#2a2a2a] rounded border border-[#444444] text-gray-400">Space</kbd> to play/stop
        </footer>
      </div>
    </div>
  );
}

export default App;

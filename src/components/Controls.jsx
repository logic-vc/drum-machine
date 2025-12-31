import { memo } from 'react';

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const StopIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <rect x="6" y="6" width="12" height="12" rx="1" />
  </svg>
);

const Controls = memo(function Controls({
  isPlaying,
  bpm,
  onPlayToggle,
  onReset,
  onBpmChange
}) {
  const handleBpmInput = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      onBpmChange(Math.min(180, Math.max(60, value)));
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1a1a1a] rounded-xl p-4 sm:p-6 border border-[#333333]">
      {/* Play/Stop Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPlayToggle}
          aria-label={isPlaying ? 'Stop' : 'Play'}
          className={`
            relative w-16 h-16 sm:w-20 sm:h-20 rounded-full
            flex items-center justify-center
            transition-all duration-200 ease-out
            focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]
            ${isPlaying
              ? 'bg-gradient-to-br from-[#ff0088] to-[#cc0066] shadow-lg shadow-[#ff0088]/40 focus:ring-[#ff0088]/50 hover:from-[#ff2299] hover:to-[#dd1177]'
              : 'bg-gradient-to-br from-[#00ff88] to-[#00cc66] shadow-lg shadow-[#00ff88]/40 focus:ring-[#00ff88]/50 hover:from-[#22ff99] hover:to-[#11dd77]'
            }
          `}
        >
          <span className="text-white drop-shadow-lg">
            {isPlaying ? <StopIcon /> : <PlayIcon />}
          </span>
          {/* Outer glow ring */}
          <div
            className={`
              absolute inset-0 rounded-full -z-10
              ${isPlaying ? 'animate-ping bg-[#ff0088]/20' : ''}
            `}
          />
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          aria-label="Reset pattern"
          className="
            px-5 py-3 rounded-lg
            bg-[#2a2a2a] border border-[#444444]
            text-gray-300 font-medium
            transition-all duration-200
            hover:bg-[#3a3a3a] hover:border-[#555555] hover:text-white
            focus:outline-none focus:ring-2 focus:ring-[#00ddff] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]
          "
        >
          초기화
        </button>
      </div>

      {/* BPM Control */}
      <div className="flex items-center gap-3 bg-[#0a0a0a] rounded-lg px-4 py-3 border border-[#333333]">
        <span className="text-gray-400 text-sm font-medium">BPM</span>

        <button
          onClick={() => onBpmChange(Math.max(60, bpm - 5))}
          aria-label="Decrease BPM"
          className="
            w-8 h-8 rounded-md
            bg-[#2a2a2a] border border-[#444444]
            text-gray-300 font-bold text-lg
            transition-all duration-150
            hover:bg-[#3a3a3a] hover:text-white
            focus:outline-none focus:ring-2 focus:ring-[#00ddff]
            flex items-center justify-center
          "
        >
          -
        </button>

        <input
          type="number"
          value={bpm}
          onChange={handleBpmInput}
          min="60"
          max="180"
          aria-label="BPM value"
          className="
            w-16 h-8 text-center
            bg-[#1a1a1a] border border-[#444444] rounded-md
            text-[#00ff88] font-mono font-bold text-lg
            focus:outline-none focus:ring-2 focus:ring-[#00ddff] focus:border-transparent
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          "
        />

        <button
          onClick={() => onBpmChange(Math.min(180, bpm + 5))}
          aria-label="Increase BPM"
          className="
            w-8 h-8 rounded-md
            bg-[#2a2a2a] border border-[#444444]
            text-gray-300 font-bold text-lg
            transition-all duration-150
            hover:bg-[#3a3a3a] hover:text-white
            focus:outline-none focus:ring-2 focus:ring-[#00ddff]
            flex items-center justify-center
          "
        >
          +
        </button>
      </div>
    </div>
  );
});

export default Controls;

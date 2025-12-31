import { memo } from 'react';
import Track from './Track';

const TRACKS = [
  { id: 'hihat-left', name: '하이햇 (L)' },
  { id: 'tom', name: '탐' },
  { id: 'floor-tom', name: '플로어 탐' },
  { id: 'ride', name: '라이드' },
  { id: 'hihat', name: '하이햇 (R)' },
  { id: 'snare', name: '스네어' },
  { id: 'bass', name: '베이스' },
];

const Sequencer = memo(function Sequencer({ pattern, currentStep, isPlaying, onTogglePad }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-3 sm:p-6 border border-[#333333] shadow-2xl">
      {/* Step numbers */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3 pb-2 border-b border-[#333333]">
        <div className="w-20 sm:w-28" />
        <div className="flex gap-1 sm:gap-1.5">
          {Array.from({ length: 16 }, (_, i) => (
            <div
              key={i}
              className={`
                w-10 h-6 sm:w-12 sm:h-7 flex items-center justify-center
                text-xs font-mono rounded
                ${isPlaying && currentStep === i
                  ? 'bg-[#00ddff]/20 text-[#00ddff] font-bold'
                  : 'text-gray-500'
                }
                ${i % 4 === 0 ? 'text-gray-400' : ''}
              `}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Tracks */}
      <div className="space-y-1">
        {TRACKS.map(track => (
          <Track
            key={track.id}
            trackId={track.id}
            trackName={track.name}
            steps={pattern[track.id]}
            currentStep={currentStep}
            isPlaying={isPlaying}
            onTogglePad={onTogglePad}
          />
        ))}
      </div>

      {/* Beat markers label */}
      <div className="flex items-center gap-2 sm:gap-3 mt-4 pt-2 border-t border-[#333333]">
        <div className="w-20 sm:w-28" />
        <div className="flex gap-1 sm:gap-1.5">
          {[1, 2, 3, 4].map(beat => (
            <div
              key={beat}
              className="w-[164px] sm:w-[198px] text-center text-xs text-gray-500"
            >
              Beat {beat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Sequencer;

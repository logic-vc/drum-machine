import { memo } from 'react';
import Pad from './Pad';

const Track = memo(function Track({ trackId, trackName, steps, currentStep, isPlaying, onTogglePad }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 py-1.5">
      {/* Track label */}
      <div className="w-20 sm:w-28 text-right pr-2 sm:pr-4">
        <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">
          {trackName}
        </span>
      </div>

      {/* Step grid */}
      <div className="flex gap-1 sm:gap-1.5">
        {steps.map((isActive, stepIndex) => (
          <div key={stepIndex} className="relative">
            {/* Beat marker (every 4 steps) */}
            {stepIndex % 4 === 0 && stepIndex !== 0 && (
              <div className="absolute -left-0.5 sm:-left-1 top-0 bottom-0 w-px bg-[#444444]" />
            )}
            <Pad
              isActive={isActive}
              isCurrentStep={isPlaying && currentStep === stepIndex}
              onClick={() => onTogglePad(trackId, stepIndex)}
              stepNumber={stepIndex}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

export default Track;

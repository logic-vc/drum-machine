import { memo } from 'react';

const Pad = memo(function Pad({ isActive, isCurrentStep, onClick, stepNumber }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Step ${stepNumber + 1}, ${isActive ? 'active' : 'inactive'}`}
      aria-pressed={isActive}
      className={`
        relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg
        transition-all duration-150 ease-out
        border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]
        ${isActive
          ? 'bg-gradient-to-br from-[#00ff88] to-[#00cc66] border-[#00ff88]/50 shadow-lg shadow-[#00ff88]/30 focus:ring-[#00ff88]'
          : 'bg-[#2a2a2a] border-[#333333] hover:bg-[#3a3a3a] hover:border-[#444444] focus:ring-[#00ddff]'
        }
        ${isCurrentStep
          ? 'ring-2 ring-[#00ddff] ring-offset-1 ring-offset-[#1a1a1a]'
          : ''
        }
        ${isActive && isCurrentStep
          ? 'animate-[pulse-glow_0.3s_ease-in-out]'
          : ''
        }
      `}
    >
      {isActive && (
        <div className="absolute inset-1 rounded-md bg-gradient-to-br from-white/20 to-transparent" />
      )}
    </button>
  );
});

export default Pad;

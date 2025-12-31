import { memo } from 'react';

const Header = memo(function Header() {
  return (
    <header className="text-center mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-[#00ff88] via-[#00ddff] to-[#ff0088] bg-clip-text text-transparent">
          Circuit Drum Machine
        </span>
      </h1>
      <p className="text-gray-500 text-sm mt-2">
        Click pads to create your beat
      </p>
    </header>
  );
});

export default Header;

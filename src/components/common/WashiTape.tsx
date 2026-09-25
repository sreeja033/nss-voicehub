import React from 'react';

interface WashiTapeProps {
  color?: 'mint' | 'yellow' | 'peach' | 'blue' | 'navy';
  className?: string;
  rotation?: number;
  width?: string;
}

export const WashiTape: React.FC<WashiTapeProps> = ({
  color = 'mint',
  className = '',
  rotation = 0,
  width = 'w-20',
}) => {
  const colorMap: Record<string, string> = {
    mint: 'bg-[#B8EADE]/85 border-t border-b border-[#38665E]/30',
    yellow: 'bg-[#FCBB4A]/75 border-t border-b border-[#7B5300]/30',
    peach: 'bg-[#FFDBD1]/90 border-t border-b border-[#A03818]/30',
    blue: 'bg-[#BFDBFE]/85 border-t border-b border-[#1D4ED8]/30',
    navy: 'bg-[#93C5FD]/85 border-t border-b border-[#1E3A8A]/30',
  };

  return (
    <div
      style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}
      className={`h-4.5 ${width} ${colorMap[color] || colorMap.mint} shadow-xs backdrop-blur-xs select-none pointer-events-none shrink-0 ${className}`}
    >
      {/* Torn jagged edges */}
      <div className="w-full h-full flex items-center justify-between opacity-40 px-1 text-[8px] font-mono tracking-widest text-black/50">
        <span>/ / /</span>
        <span>/ / /</span>
      </div>
    </div>
  );
};

import React from 'react';

export function DiyaDecoration() {
  return (
    <div className="pointer-events-none select-none overflow-hidden">
      {/* Top Marigold Garland Bunting */}
      <div className="w-full flex justify-between items-center px-4 pt-1 opacity-80">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center animate-marigold-sway" style={{ animationDelay: `${i * 0.2}s` }}>
            {/* Thread */}
            <div className="h-2 w-0.5 bg-amber-600/40"></div>
            {/* Flower */}
            <div className={`w-5 h-5 rounded-full ${i % 2 === 0 ? 'bg-amber-500 shadow-amber-400' : 'bg-saffron-600 shadow-saffron-500'} shadow-md border border-amber-300/40 flex items-center justify-center`}>
              <div className="w-2 h-2 rounded-full bg-yellow-200"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Diya Flame Background Accents */}
      <div className="fixed top-24 left-6 animate-float z-0 opacity-80 hidden md:block">
        <div className="relative flex flex-col items-center">
          {/* Flame */}
          <div className="w-4 h-6 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-full animate-diya-flicker"></div>
          {/* Lamp Base */}
          <div className="w-8 h-4 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800 rounded-b-full border-t border-amber-400 shadow-lg"></div>
        </div>
      </div>

      <div className="fixed top-36 right-8 animate-float z-0 opacity-80 hidden md:block" style={{ animationDelay: '1.2s' }}>
        <div className="relative flex flex-col items-center">
          {/* Flame */}
          <div className="w-4 h-6 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-full animate-diya-flicker" style={{ animationDelay: '0.7s' }}></div>
          {/* Lamp Base */}
          <div className="w-8 h-4 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800 rounded-b-full border-t border-amber-400 shadow-lg"></div>
        </div>
      </div>
    </div>
  );
}

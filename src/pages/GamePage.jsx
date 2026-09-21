import React from 'react';
import { GameCanvas } from '../components/GameCanvas';

export function GamePage({ playerObstacle, playerName, obstaclesPool, onObstacleSmashed, onFinishGame }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      
      {/* Top Reminder banner of player's obstacle */}
      {playerObstacle && (
        <div className="glass-card px-5 py-3 rounded-2xl border border-amber-300 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪔</span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700 block">Your Current Mission:</span>
              <span className="font-handwritten text-lg font-bold text-slate-900">"{playerObstacle.text}"</span>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-saffron-100 text-saffron-800">
            {playerObstacle.category}
          </span>
        </div>
      )}

      {/* Canvas Game */}
      <GameCanvas
        playerObstacle={playerObstacle}
        availableObstacles={obstaclesPool}
        onObstacleSmashed={onObstacleSmashed}
        onGameOver={onFinishGame}
        playerName={playerName}
      />

    </div>
  );
}

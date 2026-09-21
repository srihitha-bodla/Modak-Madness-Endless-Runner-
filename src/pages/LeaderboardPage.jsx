import React from 'react';
import { Trophy, Medal, Sparkles, RefreshCw, Zap } from 'lucide-react';

export function LeaderboardPage({ leaderboard, loading, isMockMode }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-saffron-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Real-time Campus Standings</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-festive">
          Vighnaharta Leaderboard
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Top devotees breaking the most campus obstacles live!
        </p>
      </div>

      {/* Leaderboard Card Container */}
      <div className="glass-card p-6 rounded-3xl border-2 border-saffron-300 shadow-xl overflow-hidden">
        
        {loading ? (
          <div className="text-center py-12 text-slate-500">
            <RefreshCw className="w-8 h-8 text-saffron-600 animate-spin mx-auto mb-2" />
            <p className="font-semibold text-sm">Fetching Live Rankings...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-base text-slate-700">No High Scores Yet!</p>
            <p className="text-xs">Be the first devotee to break an obstacle and claim #1 on the leaderboard.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isTop1 = rank === 1;
              const isTop2 = rank === 2;
              const isTop3 = rank === 3;

              return (
                <div
                  key={entry.id || index}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    isTop1
                      ? 'gold-gradient-bg text-amber-950 border-amber-400 shadow-md font-bold scale-101'
                      : isTop2
                      ? 'bg-slate-100 border-slate-300 text-slate-900 font-semibold'
                      : isTop3
                      ? 'bg-amber-50 border-amber-200 text-amber-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  {/* Rank & Name */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-base shadow-sm">
                      {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${rank}`}
                    </div>
                    <div>
                      <div className="text-base font-bold tracking-tight">
                        {entry.player_name || 'Anonymous Devotee'}
                      </div>
                      <div className="text-[11px] opacity-75 font-medium">
                        {new Date(entry.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="flex items-center justify-end gap-1 font-extrabold text-base">
                        <Zap className="w-4 h-4 text-saffron-600 fill-saffron-500" />
                        <span>{entry.obstacles_destroyed}</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">Smashed</span>
                    </div>

                    <div className="pl-3 border-l border-black/10">
                      <div className="flex items-center justify-end gap-1 font-bold text-sm">
                        <span>🥮</span>
                        <span>{entry.modaks_collected}</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">Modaks</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Grid, Sparkles, Zap, PlusCircle, Award } from 'lucide-react';

export function GameOverPage({
  gameResult,
  playerObstacle,
  playerName,
  sessionBestScore = 0,
  onInstantRetry,
  onSubmitNewObstacle,
  onNavigate
}) {
  useEffect(() => {
    // Trigger festive celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#eab308', '#dc2626', '#059669', '#3b82f6']
      });
    } catch (e) {
      console.log('Confetti effect trigger:', e);
    }
  }, []);

  const totalScore = gameResult?.score || 0;
  const modaks = gameResult?.modaks || 0;
  const smashed = gameResult?.smashed || 0;
  const isNewSessionBest = totalScore > 0 && totalScore >= sessionBestScore;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="glass-card p-6 sm:p-8 rounded-3xl border-2 border-amber-400 shadow-2xl text-center space-y-6">
        
        {/* Festive Header Icon */}
        <div className="w-16 h-16 rounded-full gold-gradient-bg text-amber-950 flex items-center justify-center mx-auto shadow-lg animate-bounce">
          <Trophy className="w-8 h-8 fill-current" />
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-festive">
            Vighnaharta Victory!
          </h2>
          <p className="text-sm font-medium text-slate-600 mt-1">
            Glorious run by <span className="font-bold text-saffron-700">{playerName || 'Devotee'}</span>
          </p>
        </div>

        {/* REFLECTIVE PERSONAL OBSTACLE MESSAGE */}
        {playerObstacle && (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 shadow-inner">
            <span className="text-xs uppercase font-extrabold tracking-widest text-saffron-700 block mb-1">
              Reflective Blessing
            </span>
            <p className="font-handwritten text-2xl font-bold text-slate-800 leading-snug my-2">
              "You just broke through: '{playerObstacle.text}'"
            </p>
            <p className="text-xs font-bold text-saffron-800 tracking-wider">
              — GANPATI BAPPA MORYA! —
            </p>
          </div>
        )}

        {/* STATS SUMMARY GRID WITH SESSION BEST SCORE */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <Zap className="w-5 h-5 text-saffron-600 mx-auto mb-1" />
            <div className="text-2xl font-extrabold text-slate-900">{smashed}</div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase">Smashed</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-lg block mb-1">🥮</span>
            <div className="text-2xl font-extrabold text-slate-900">{modaks}</div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase">Modaks</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <div className="text-2xl font-extrabold text-slate-900">{totalScore}</div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase">Run Score</div>
          </div>

          <div className={`p-3.5 rounded-2xl border shadow-sm ${
            isNewSessionBest 
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300' 
              : 'bg-white border-slate-200'
          }`}>
            <Award className={`w-5 h-5 mx-auto mb-1 ${isNewSessionBest ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`} />
            <div className="text-2xl font-extrabold text-slate-900">{sessionBestScore}</div>
            <div className="text-[10px] font-bold text-saffron-700 uppercase flex items-center justify-center gap-0.5">
              <span>Best Session</span>
              {isNewSessionBest && <span className="text-[9px] bg-amber-400 text-amber-950 px-1 rounded font-extrabold">NEW!</span>}
            </div>
          </div>
        </div>

        {/* PRIMARY UNLIMITED RETRY ACTION BUTTON */}
        <div className="pt-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onInstantRetry}
              className="w-full sm:w-auto px-8 py-4 rounded-full saffron-gradient-bg text-white font-extrabold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
              <span>Retry Now (Instant Start)</span>
            </button>

            <button
              onClick={() => onNavigate('leaderboard')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white text-slate-700 hover:text-saffron-700 font-bold text-sm border border-slate-300 hover:border-saffron-300 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              Leaderboard
            </button>

            <button
              onClick={() => onNavigate('community')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white text-slate-700 hover:text-saffron-700 font-bold text-sm border border-slate-300 hover:border-saffron-300 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Grid className="w-4 h-4 text-saffron-600" />
              Community Wall
            </button>
          </div>

          {/* SECONDARY OPTION: SUBMIT A NEW OBSTACLE */}
          <div>
            <button
              onClick={onSubmitNewObstacle}
              className="text-xs font-semibold text-saffron-700 hover:text-saffron-900 hover:underline flex items-center justify-center gap-1 mx-auto py-1 px-3 rounded-full hover:bg-amber-50 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-saffron-600" />
              <span>Want to add another personal goal? Submit a new obstacle</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}


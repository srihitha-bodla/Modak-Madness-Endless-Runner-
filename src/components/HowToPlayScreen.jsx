import React from 'react';
import { Sparkles, Play, ArrowUp, ArrowDown, Zap } from 'lucide-react';

export function HowToPlayScreen({ onContinue }) {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto text-center space-y-6">
      
      {/* Festive Header */}
      <div className="space-y-2">
        <div className="w-14 h-14 rounded-full gold-gradient-bg text-amber-950 flex items-center justify-center mx-auto shadow-lg animate-bounce">
          <Sparkles className="w-7 h-7 fill-current" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-festive">
          How to Play
        </h2>
        <p className="text-xs font-semibold text-saffron-700 tracking-wide uppercase">
          Master Mushika's Divine Journey
        </p>
      </div>

      {/* 2 Instruction Cards */}
      <div className="w-full space-y-4">
        
        {/* Card 1: Move Mushika */}
        <div className="glass-card p-5 rounded-2xl border border-amber-300 shadow-md text-left flex items-start gap-4 transition-transform hover:scale-[1.02]">
          <div className="w-12 h-12 rounded-xl bg-saffron-100 border border-saffron-300 flex items-center justify-center shrink-0 text-2xl shadow-sm">
            🐭
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center justify-between">
              <span>Move Mushika</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-800 uppercase">Controls</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Swipe up or tap <strong className="text-saffron-700">Jump</strong> to leap over low barriers. 
              Swipe down or tap <strong className="text-amber-700">Duck</strong> to slide under overhead blocks.
            </p>
          </div>
        </div>

        {/* Card 2: Collect & Smash */}
        <div className="glass-card p-5 rounded-2xl border border-amber-300 shadow-md text-left flex items-start gap-4 transition-transform hover:scale-[1.02]">
          <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-2xl shadow-sm">
            🥮
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center justify-between">
              <span>Collect & Smash</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase">Power-Up</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Collect divine modaks to charge your <strong className="text-amber-700">Smash Meter</strong>. 
              Activate Super Smash to break through real campus obstacle blocks!
            </p>
          </div>
        </div>

      </div>

      {/* Start Playing CTA Button */}
      <button
        onClick={onContinue}
        className="w-full sm:w-auto px-10 py-4 rounded-full saffron-gradient-bg text-white font-extrabold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group min-h-[52px] touch-manipulation"
      >
        <Play className="w-5 h-5 fill-current group-hover:translate-x-1 transition-transform" />
        <span>Start Playing</span>
      </button>

    </div>
  );
}

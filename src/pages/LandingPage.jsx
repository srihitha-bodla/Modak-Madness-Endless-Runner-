import React from 'react';
import { Flame, Sparkles, ShieldAlert, Award, ArrowRight, HeartHandshake, Zap } from 'lucide-react';

export function LandingPage({ totalDestroyed, onStartPlay, onNavigate }) {
  return (
    <div className="space-y-16 py-6">
      
      {/* HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto px-4 pt-8 pb-12">
        
        {/* Festive Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold shadow-sm mb-6 animate-pulse">
          <Sparkles className="w-4 h-4 text-saffron-600" />
          <span>Ganesh Chaturthi Campus Special Festival Game</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 font-festive">
          <span className="festive-gradient-text block mb-1">Vighnaharta</span>
          <span className="text-slate-800 text-3xl sm:text-5xl font-sans font-bold">Break My Obstacle</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Offer your real-life personal challenges—exam stress, procrastination, or fear—to Lord Ganesha & Mushika, then smash them together with your peers in real-time!
        </p>

        {/* LIVE REALTIME COUNTER HERO CARD */}
        <div className="max-w-md mx-auto glass-card p-6 rounded-3xl border-2 border-saffron-300 shadow-xl mb-10 transform hover:scale-102 transition-transform">
          <div className="text-xs uppercase font-bold tracking-widest text-saffron-700 mb-1 flex items-center justify-center gap-1.5">
            <Flame className="w-4 h-4 text-saffron-600 fill-saffron-500 animate-bounce" />
            Live Campus Impact
          </div>
          <div className="text-5xl font-extrabold text-saffron-900 tracking-tight my-2 font-festive">
            {totalDestroyed.toLocaleString()}
          </div>
          <div className="text-sm font-medium text-slate-600">
            Real Personal Obstacles Smashed by Devotees So Far
          </div>
        </div>

        {/* CTA BUTTON */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartPlay}
            className="w-full sm:w-auto px-8 py-4 rounded-full saffron-gradient-bg text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Zap className="w-6 h-6 text-yellow-200 fill-yellow-200" />
            Enter Your Obstacle & Play
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('community')}
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-white text-slate-700 hover:text-saffron-700 font-bold text-base border border-saffron-200 hover:border-saffron-300 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
          >
            View Community Wall
          </button>
        </div>

      </section>

      {/* THREE STEP HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-10 font-festive">
          How Vighnaharta Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card p-6 rounded-2xl border border-saffron-200 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl saffron-gradient-bg text-white font-extrabold text-xl flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Submit Your Obstacle</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Type in whatever is holding you back—exam stress, procrastination, or career anxiety.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-amber-200 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl gold-gradient-bg text-amber-950 font-extrabold text-xl flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Play as Divine Mushika</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Run through the endless path, collect sweet Modaks, and charge your Vighnaharta Smash Meter.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-emerald-200 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Smash in Real-Time</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Crash through everyone's obstacles! Every smashed block is instantly marked as broken across the campus live feed.
            </p>
          </div>

        </div>
      </section>

      {/* FESTIVE FOOTER BLESSING */}
      <section className="max-w-4xl mx-auto px-4 text-center py-6 border-t border-saffron-200/60">
        <p className="font-handwritten text-2xl font-bold text-saffron-800">
          "Vakratunda Mahakaya Surya Koti Samaprabha, Nirvighnam Kuru Me Deva Sarva Karyesu Sarvada"
        </p>
        <p className="text-xs text-slate-500 mt-2">
          May Lord Ganesha remove all obstacles from your path. Happy Ganesh Chaturthi!
        </p>
      </section>

    </div>
  );
}

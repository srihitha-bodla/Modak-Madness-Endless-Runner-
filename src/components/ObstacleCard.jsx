import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

const CATEGORY_STYLES = {
  Academic: {
    bg: 'bg-blue-50 border-blue-200 text-blue-900',
    tag: 'bg-blue-600 text-white',
    accent: '#2563eb'
  },
  Personal: {
    bg: 'bg-purple-50 border-purple-200 text-purple-900',
    tag: 'bg-purple-600 text-white',
    accent: '#9333ea'
  },
  Health: {
    bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    tag: 'bg-emerald-600 text-white',
    accent: '#059669'
  },
  Career: {
    bg: 'bg-orange-50 border-orange-200 text-orange-900',
    tag: 'bg-orange-600 text-white',
    accent: '#ea580c'
  },
  Other: {
    bg: 'bg-slate-50 border-slate-200 text-slate-900',
    tag: 'bg-slate-600 text-white',
    accent: '#64748b'
  }
};

export function ObstacleCard({ obstacle }) {
  const style = CATEGORY_STYLES[obstacle.category] || CATEGORY_STYLES.Other;
  const isDestroyed = obstacle.destroyed;

  return (
    <div 
      className={`relative p-5 rounded-2xl border transition-all duration-300 shadow-md ${
        isDestroyed 
          ? `${style.bg} shattered-tile ring-2 ring-amber-400/50` 
          : 'bg-white border-slate-200 text-slate-700 hover:shadow-lg'
      }`}
    >
      {/* Category Tag & Status Icon */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${style.tag}`}>
          {obstacle.category}
        </span>
        {isDestroyed ? (
          <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300">
            <Zap className="w-3.5 h-3.5 text-saffron-600 fill-saffron-500" /> Smashed
          </span>
        ) : (
          <span className="text-xs text-slate-400 font-medium">Active</span>
        )}
      </div>

      {/* Main Obstacle Text */}
      <p className="font-handwritten text-xl font-bold text-slate-800 leading-snug mb-4 break-words">
        "{obstacle.text}"
      </p>

      {/* Footer Info */}
      <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className={`w-4 h-4 ${isDestroyed ? 'text-amber-600' : 'text-slate-400'}`} />
          <span>{isDestroyed ? `Smashed by ${obstacle.destroyed_by || 'Devotee'}` : 'Awaiting Vighnaharta'}</span>
        </div>
        <span className="text-[10px] text-slate-400">
          {new Date(obstacle.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Crack Line Overlay for Shattered Tile */}
      {isDestroyed && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0 20 L 35 45 L 60 30 L 100 70 M 35 45 L 40 100 M 60 30 L 70 0" stroke={style.accent} strokeWidth="1.5" fill="none" strokeDasharray="3,3" />
        </svg>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { ObstacleCard } from '../components/ObstacleCard';
import { Sparkles, Search, Grid, Filter, ShieldCheck } from 'lucide-react';

export function CommunityWallPage({ destroyedWall, loading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Academic', 'Personal', 'Health', 'Career', 'Other'];

  const filtered = destroyedWall.filter(obs => {
    const matchesCategory = selectedCategory === 'All' || obs.category === selectedCategory;
    const matchesSearch = 
      obs.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (obs.destroyed_by && obs.destroyed_by.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* HEADER SECTION FOR LIVE EVENT PROJECTION */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3">
          <Sparkles className="w-4 h-4 text-saffron-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Live Projection Wall</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-festive">
          Campus Obstacle Shatter Wall
        </h1>
        <p className="text-base text-slate-600 mt-2">
          Every tile below represents a real personal obstacle broken through by Ganesha's devotees during the festival!
        </p>
      </div>

      {/* CONTROLS BAR: SEARCH & CATEGORY FILTER */}
      <div className="glass-card p-4 rounded-2xl border border-saffron-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search obstacle or devotee..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-saffron-500 outline-none text-sm bg-white"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'saffron-gradient-bg text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-saffron-50 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* SHATTERED TILES GRID */}
      {loading ? (
        <div className="text-center py-16 text-slate-500">
          <Sparkles className="w-8 h-8 text-saffron-600 animate-spin mx-auto mb-2" />
          <p className="font-semibold text-sm">Loading Destroyed Wall Tiles...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-3xl border border-dashed border-slate-300">
          <Grid className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No Destroyed Obstacles Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your search or category filter.'
              : 'Play the game, smash obstacles, and watch them shatter onto this wall in real time!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((obs) => (
            <ObstacleCard key={obs.id} obstacle={obs} />
          ))}
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { Volume2, VolumeX, Flame, Trophy, Grid, Play, Home, Sparkles, Menu, X } from 'lucide-react';
import { audioManager } from '../lib/audio';

export function Navbar({ activePage, setActivePage, totalDestroyed }) {
  const [isMuted, setIsMuted] = useState(audioManager.getMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAudioToggle = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'play', label: 'Play', icon: Play },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'community', label: 'Community Wall', icon: Grid },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-saffron-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <button 
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full saffron-gradient-bg flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 fill-yellow-200 text-yellow-200 animate-pulse" />
            </div>
            <div>
              <span className="font-festive text-xl font-bold text-saffron-900 tracking-wide block leading-tight">
                Vighnaharta
              </span>
              <span className="text-[10px] font-sans tracking-widest text-saffron-700 uppercase font-semibold">
                Break My Obstacle
              </span>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id || (item.id === 'play' && activePage === 'submit');
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id === 'play' ? 'submit' : item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all ${
                    isActive
                      ? 'saffron-gradient-bg text-white shadow-md scale-105'
                      : 'text-slate-700 hover:text-saffron-700 hover:bg-saffron-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Live Counter Badge & Audio Mute */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Realtime Counter Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-saffron-600 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{totalDestroyed} Broken</span>
            </div>

            {/* Audio Mute Button */}
            <button
              onClick={handleAudioToggle}
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
              className="p-2 rounded-full text-slate-700 hover:text-saffron-700 hover:bg-saffron-100 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-saffron-600" />}
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleAudioToggle}
              className="p-2 rounded-full text-slate-700 hover:bg-saffron-50"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-saffron-600" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-saffron-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 border-b border-saffron-200 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between px-3 py-2 bg-amber-50 rounded-lg text-xs font-semibold text-amber-900 mb-2">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-saffron-600" /> Campus Impact
            </span>
            <span className="bg-saffron-600 text-white px-2 py-0.5 rounded-full">{totalDestroyed} Obstacles Broken</span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id || (item.id === 'play' && activePage === 'submit');
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id === 'play' ? 'submit' : item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left font-medium text-sm transition-all ${
                  isActive
                    ? 'saffron-gradient-bg text-white font-semibold'
                    : 'text-slate-700 hover:bg-saffron-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}

import { createClient } from '@supabase/supabase-js';
import { INITIAL_MOCK_OBSTACLES, INITIAL_MOCK_SCORES, INITIAL_MOCK_STATS } from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('PASTE_YOUR') && 
  !supabaseAnonKey.includes('PASTE_YOUR')
);

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;
export const isMockMode = !isConfigured;

// LocalStorage key fallbacks for Mock Mode
const MOCK_OBSTACLES_KEY = 'vighnaharta_mock_obstacles';
const MOCK_SCORES_KEY = 'vighnaharta_mock_scores';
const MOCK_STATS_KEY = 'vighnaharta_mock_stats';

export const getMockState = () => {
  let obstacles = JSON.parse(localStorage.getItem(MOCK_OBSTACLES_KEY) || 'null');
  if (!obstacles) {
    obstacles = INITIAL_MOCK_OBSTACLES;
    localStorage.setItem(MOCK_OBSTACLES_KEY, JSON.stringify(obstacles));
  }

  let scores = JSON.parse(localStorage.getItem(MOCK_SCORES_KEY) || 'null');
  if (!scores) {
    scores = INITIAL_MOCK_SCORES;
    localStorage.setItem(MOCK_SCORES_KEY, JSON.stringify(scores));
  }

  let stats = JSON.parse(localStorage.getItem(MOCK_STATS_KEY) || 'null');
  if (!stats) {
    stats = INITIAL_MOCK_STATS;
    localStorage.setItem(MOCK_STATS_KEY, JSON.stringify(stats));
  }

  return { obstacles, scores, stats };
};

export const updateMockState = (updater) => {
  const current = getMockState();
  const next = updater(current);
  if (next.obstacles) localStorage.setItem(MOCK_OBSTACLES_KEY, JSON.stringify(next.obstacles));
  if (next.scores) localStorage.setItem(MOCK_SCORES_KEY, JSON.stringify(next.scores));
  if (next.stats) localStorage.setItem(MOCK_STATS_KEY, JSON.stringify(next.stats));
  
  // Dispatch custom event for real-time local listeners
  window.dispatchEvent(new CustomEvent('vighnaharta_mock_update', { detail: next }));
  return next;
};

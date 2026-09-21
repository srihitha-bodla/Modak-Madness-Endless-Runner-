import React, { useState } from 'react';
import { Flame, Sparkles, Send, User, MessageSquare, Tag } from 'lucide-react';

const CATEGORIES = [
  { id: 'Academic', label: 'Academic', color: 'bg-blue-600 text-white', border: 'border-blue-300' },
  { id: 'Personal', label: 'Personal', color: 'bg-purple-600 text-white', border: 'border-purple-300' },
  { id: 'Health', label: 'Health', color: 'bg-emerald-600 text-white', border: 'border-emerald-300' },
  { id: 'Career', label: 'Career', color: 'bg-orange-600 text-white', border: 'border-orange-300' },
  { id: 'Other', label: 'Other', color: 'bg-slate-600 text-white', border: 'border-slate-300' },
];

export function SubmissionPage({ onSubmitObstacle }) {
  const [playerName, setPlayerName] = useState('');
  const [obstacleText, setObstacleText] = useState('');
  const [category, setCategory] = useState('Academic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanText = obstacleText.trim();
    if (!cleanText) {
      setErrorMsg('Please enter an obstacle before playing!');
      return;
    }
    if (cleanText.length > 60) {
      setErrorMsg('Obstacle text must be under 60 characters.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await onSubmitObstacle({
        playerName: playerName.trim() || 'Anonymous Devotee',
        text: cleanText,
        category: category
      });
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="glass-card p-5 sm:p-8 rounded-3xl border-2 border-saffron-300 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 rounded-full saffron-gradient-bg text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Flame className="w-6 h-6 fill-yellow-200 text-yellow-200" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-festive">
            Offer Your Obstacle to Lord Ganesha
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Write down what is troubling you. It will become a breakable block in the game for everyone to smash!
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-100 border border-red-300 text-red-700 text-sm font-semibold rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          
          {/* Player Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-saffron-600" />
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="e.g. Sneha, Aarav (or leave blank for Anonymous)"
              maxLength={30}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 outline-none text-slate-800 bg-white/90 text-base"
            />
          </div>

          {/* Obstacle Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-saffron-600" />
                What obstacle do you want to break?
              </label>
              <span className={`text-xs font-bold ${obstacleText.length > 50 ? 'text-orange-600' : 'text-slate-400'}`}>
                {obstacleText.length}/60
              </span>
            </div>
            <textarea
              value={obstacleText}
              onChange={(e) => setObstacleText(e.target.value)}
              placeholder="e.g. Exam anxiety, procrastination, bug in code..."
              rows={3}
              maxLength={60}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 outline-none text-slate-800 bg-white/90 font-medium text-base resize-none"
            />
          </div>

          {/* Category Dropdown/Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-saffron-600" />
              Select Category (Sets block color in-game)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-3 rounded-xl text-xs font-bold transition-all border min-h-[44px] flex items-center justify-center ${
                    category === cat.id
                      ? `${cat.color} shadow-md scale-102`
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl saffron-gradient-bg text-white font-extrabold text-base sm:text-lg shadow-xl hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 min-h-[50px] touch-manipulation"
          >
            <Send className="w-5 h-5" />
            {isSubmitting ? 'Preparing Canvas...' : 'Break This Obstacle & Play!'}
          </button>

        </form>

      </div>
    </div>
  );
}

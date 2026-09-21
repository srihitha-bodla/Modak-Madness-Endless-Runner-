import React, { useState } from 'react';
import { useSupabaseData } from './hooks/useSupabaseData';
import { Navbar } from './components/Navbar';
import { DiyaDecoration } from './components/DiyaDecoration';
import { LandingPage } from './pages/LandingPage';
import { SubmissionPage } from './pages/SubmissionPage';
import { GamePage } from './pages/GamePage';
import { GameOverPage } from './pages/GameOverPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { CommunityWallPage } from './pages/CommunityWallPage';

export function App() {
  const [activePage, setActivePage] = useState('home');
  const [playerObstacle, setPlayerObstacle] = useState(null);
  const [playerName, setPlayerName] = useState('Anonymous Devotee');
  const [gameResult, setGameResult] = useState(null);

  const {
    totalDestroyed,
    obstacles,
    leaderboard,
    destroyedWall,
    loading,
    addObstacle,
    smashObstacle,
    submitScore,
    isMockMode
  } = useSupabaseData();

  // 1. Submit Obstacle and launch Game
  const handleObstacleSubmitted = async ({ playerName: name, text, category }) => {
    setPlayerName(name);
    const created = await addObstacle(name, text, category);
    setPlayerObstacle(created);
    setActivePage('game');
    return created;
  };

  // 2. Handle Obstacle Smashed during Game Run
  const handleObstacleSmashed = (obstacle) => {
    if (obstacle && obstacle.id) {
      smashObstacle(obstacle.id, playerName);
    }
  };

  // 3. Handle Game Over Sequence
  const handleGameOver = async (result) => {
    setGameResult(result);
    if (result.smashed > 0 || result.modaks > 0) {
      await submitScore(playerName, result.smashed, result.modaks);
    }
    setActivePage('gameover');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-cream-100 selection:bg-saffron-500 selection:text-white">
      
      {/* Background Festive Diya & Garland Decorations */}
      <DiyaDecoration />

      {/* Main Persistent Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        totalDestroyed={totalDestroyed}
      />

      {/* Main Page View Router */}
      <main className="flex-1 pb-12 z-10">
        {activePage === 'home' && (
          <LandingPage
            totalDestroyed={totalDestroyed}
            onStartPlay={() => setActivePage('submit')}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'submit' && (
          <SubmissionPage
            onSubmitObstacle={handleObstacleSubmitted}
          />
        )}

        {activePage === 'game' && (
          <GamePage
            playerObstacle={playerObstacle}
            playerName={playerName}
            obstaclesPool={obstacles}
            onObstacleSmashed={handleObstacleSmashed}
            onFinishGame={handleGameOver}
          />
        )}

        {activePage === 'gameover' && (
          <GameOverPage
            gameResult={gameResult}
            playerObstacle={playerObstacle}
            playerName={playerName}
            onPlayAgain={() => setActivePage('submit')}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'leaderboard' && (
          <LeaderboardPage
            leaderboard={leaderboard}
            loading={loading}
            isMockMode={isMockMode}
          />
        )}

        {activePage === 'community' && (
          <CommunityWallPage
            destroyedWall={destroyedWall}
            loading={loading}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 border-t border-saffron-200 py-6 text-center text-xs text-slate-500 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🪔 Vighnaharta: Break My Obstacle — Ganesh Chaturthi Interactive Game</span>
          <span>Powered by React + HTML5 Canvas + Supabase</span>
        </div>
      </footer>

    </div>
  );
}

export default App;

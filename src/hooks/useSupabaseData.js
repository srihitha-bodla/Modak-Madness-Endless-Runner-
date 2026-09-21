import { useState, useEffect, useCallback } from 'react';
import { supabase, isMockMode, getMockState, updateMockState } from '../lib/supabase';
import { INITIAL_MOCK_OBSTACLES } from '../lib/mockData';

export function useSupabaseData() {
  const [totalDestroyed, setTotalDestroyed] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [destroyedWall, setDestroyedWall] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Stats from Supabase 'stats' table
  const fetchStats = useCallback(async () => {
    if (isMockMode || !supabase) {
      const state = getMockState();
      setTotalDestroyed(state.stats.total_obstacles_destroyed);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('stats')
        .select('total_obstacles_destroyed')
        .eq('id', 1)
        .maybeSingle();

      if (!error && data) {
        setTotalDestroyed(data.total_obstacles_destroyed ?? 0);
      } else if (!data) {
        // Upsert default single row id=1 if not present
        await supabase
          .from('stats')
          .upsert({ id: 1, total_obstacles_destroyed: 0 });
        setTotalDestroyed(0);
      }
    } catch (err) {
      console.error('Error fetching stats from Supabase:', err);
    }
  }, []);

  // Fetch Obstacles from Supabase 'obstacles' table (most recent 50)
  const fetchObstacles = useCallback(async () => {
    if (isMockMode || !supabase) {
      const state = getMockState();
      setObstacles(state.obstacles);
      setDestroyedWall(state.obstacles.filter(o => o.destroyed));
      return;
    }
    try {
      const { data, error } = await supabase
        .from('obstacles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        // If DB has custom obstacles, use them; if empty, seed with campus starter pack
        const list = data.length > 0 ? data : INITIAL_MOCK_OBSTACLES;
        setObstacles(list);
        setDestroyedWall(list.filter(o => o.destroyed));
      }
    } catch (err) {
      console.error('Error fetching obstacles from Supabase:', err);
    }
  }, []);

  // Fetch Leaderboard from Supabase 'scores' table (top 10)
  const fetchLeaderboard = useCallback(async () => {
    if (isMockMode || !supabase) {
      const state = getMockState();
      const sorted = [...state.scores].sort((a, b) => b.obstacles_destroyed - a.obstacles_destroyed).slice(0, 10);
      setLeaderboard(sorted);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('obstacles_destroyed', { ascending: false })
        .limit(10);

      if (!error && data) {
        setLeaderboard(data);
      }
    } catch (err) {
      console.error('Error fetching leaderboard from Supabase:', err);
    }
  }, []);

  // Set up real-time subscriptions / event listeners
  useEffect(() => {
    let statsChannel;
    let scoresChannel;
    let obstaclesChannel;

    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchObstacles(), fetchLeaderboard()]);
      setLoading(false);
    };

    initData();

    if (isMockMode || !supabase) {
      const handleMockUpdate = () => {
        fetchStats();
        fetchObstacles();
        fetchLeaderboard();
      };
      window.addEventListener('vighnaharta_mock_update', handleMockUpdate);
      return () => {
        window.removeEventListener('vighnaharta_mock_update', handleMockUpdate);
      };
    } else {
      // Live Supabase Real-time Subscriptions
      statsChannel = supabase
        .channel('public:stats')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'stats' }, payload => {
          if (payload.new && payload.new.total_obstacles_destroyed !== undefined) {
            setTotalDestroyed(payload.new.total_obstacles_destroyed);
          } else {
            fetchStats();
          }
        })
        .subscribe();

      scoresChannel = supabase
        .channel('public:scores')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, () => {
          fetchLeaderboard();
        })
        .subscribe();

      obstaclesChannel = supabase
        .channel('public:obstacles')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'obstacles' }, () => {
          fetchObstacles();
        })
        .subscribe();

      return () => {
        if (statsChannel) supabase.removeChannel(statsChannel);
        if (scoresChannel) supabase.removeChannel(scoresChannel);
        if (obstaclesChannel) supabase.removeChannel(obstaclesChannel);
      };
    }
  }, [fetchStats, fetchObstacles, fetchLeaderboard]);

  // Insert a new obstacle into Supabase 'obstacles' table
  const addObstacle = async (playerName, text, category) => {
    const cleanPlayer = playerName.trim() || 'Anonymous Devotee';
    const cleanText = text.trim();
    const cleanCat = category || 'Other';

    if (isMockMode || !supabase) {
      const newObs = {
        id: Date.now(),
        text: cleanText,
        category: cleanCat,
        destroyed: false,
        destroyed_by: null,
        created_at: new Date().toISOString()
      };
      updateMockState(prev => ({
        ...prev,
        obstacles: [newObs, ...prev.obstacles]
      }));
      return newObs;
    }

    try {
      const { data, error } = await supabase
        .from('obstacles')
        .insert([{ text: cleanText, category: cleanCat, destroyed: false }])
        .select()
        .single();

      if (error) throw error;
      fetchObstacles();
      return data;
    } catch (err) {
      console.error('Failed to add obstacle to Supabase:', err);
      return { id: Date.now(), text: cleanText, category: cleanCat, destroyed: false };
    }
  };

  // Mark obstacle destroyed & increment global total counter in Supabase
  const smashObstacle = async (obstacleId, playerName) => {
    const breaker = playerName || 'Anonymous Devotee';

    if (isMockMode || !supabase) {
      updateMockState(prev => {
        const nextObstacles = prev.obstacles.map(obs => {
          if (obs.id === obstacleId) {
            return { ...obs, destroyed: true, destroyed_by: breaker };
          }
          return obs;
        });
        const nextStats = {
          ...prev.stats,
          total_obstacles_destroyed: prev.stats.total_obstacles_destroyed + 1
        };
        return { ...prev, obstacles: nextObstacles, stats: nextStats };
      });
      return;
    }

    try {
      // 1. Update obstacle
      await supabase
        .from('obstacles')
        .update({ destroyed: true, destroyed_by: breaker })
        .eq('id', obstacleId);

      // 2. Fetch current total stats and increment via upsert
      const { data: currentStats } = await supabase
        .from('stats')
        .select('total_obstacles_destroyed')
        .eq('id', 1)
        .maybeSingle();

      const newTotal = (currentStats?.total_obstacles_destroyed || 0) + 1;

      await supabase
        .from('stats')
        .upsert({ id: 1, total_obstacles_destroyed: newTotal });

      fetchStats();
      fetchObstacles();
    } catch (err) {
      console.error('Error smashing obstacle in Supabase:', err);
    }
  };

  // Submit score to Supabase 'scores' table
  const submitScore = async (playerName, obstaclesDestroyed, modaksCollected) => {
    const cleanPlayer = playerName.trim() || 'Anonymous Devotee';

    if (isMockMode || !supabase) {
      const newScore = {
        id: Date.now(),
        player_name: cleanPlayer,
        obstacles_destroyed: obstaclesDestroyed,
        modaks_collected: modaksCollected,
        created_at: new Date().toISOString()
      };
      updateMockState(prev => ({
        ...prev,
        scores: [...prev.scores, newScore]
      }));
      return;
    }

    try {
      await supabase.from('scores').insert([
        {
          player_name: cleanPlayer,
          obstacles_destroyed: obstaclesDestroyed,
          modaks_collected: modaksCollected
        }
      ]);
      fetchLeaderboard();
    } catch (err) {
      console.error('Error submitting score to Supabase:', err);
    }
  };

  return {
    totalDestroyed,
    obstacles,
    leaderboard,
    destroyedWall,
    loading,
    addObstacle,
    smashObstacle,
    submitScore,
    isMockMode: isMockMode || !supabase
  };
}

export const INITIAL_MOCK_OBSTACLES = [
  { id: 101, text: "Exam Stress & Sleepless Nights", category: "Academic", destroyed: false, destroyed_by: null, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 102, text: "Procrastinating on Final Project", category: "Academic", destroyed: true, destroyed_by: "Ananya S.", created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 103, text: "Fear of Public Speaking", category: "Personal", destroyed: false, destroyed_by: null, created_at: new Date(Date.now() - 10800000).toISOString() },
  { id: 104, text: "Unhealthy Junk Food Cravings", category: "Health", destroyed: true, destroyed_by: "Aarav Tech", created_at: new Date(Date.now() - 14400000).toISOString() },
  { id: 105, text: "Placement Interview Anxiety", category: "Career", destroyed: false, destroyed_by: null, created_at: new Date(Date.now() - 18000000).toISOString() },
  { id: 106, text: "Overthinking Small Mistakes", category: "Personal", destroyed: true, destroyed_by: "Rohan K.", created_at: new Date(Date.now() - 21600000).toISOString() },
  { id: 107, text: "Messy Hostel Room & Laundry", category: "Other", destroyed: false, destroyed_by: null, created_at: new Date(Date.now() - 25200000).toISOString() },
  { id: 108, text: "Imposter Syndrome in Coding", category: "Academic", destroyed: true, destroyed_by: "Sneha Dev", created_at: new Date(Date.now() - 28800000).toISOString() },
  { id: 109, text: "Skipping Morning Workouts", category: "Health", destroyed: false, destroyed_by: null, created_at: new Date(Date.now() - 32400000).toISOString() },
  { id: 110, text: "Resume Formatting Headaches", category: "Career", destroyed: true, destroyed_by: "Vikram R.", created_at: new Date(Date.now() - 36000000).toISOString() },
];

export const INITIAL_MOCK_SCORES = [
  { id: 1, player_name: "Sneha Dev", obstacles_destroyed: 18, modaks_collected: 42, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, player_name: "Aarav Tech", obstacles_destroyed: 15, modaks_collected: 35, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, player_name: "Ananya S.", obstacles_destroyed: 12, modaks_collected: 28, created_at: new Date(Date.now() - 10800000).toISOString() },
  { id: 4, player_name: "Vikram R.", obstacles_destroyed: 10, modaks_collected: 22, created_at: new Date(Date.now() - 14400000).toISOString() },
  { id: 5, player_name: "Rohan K.", obstacles_destroyed: 8, modaks_collected: 19, created_at: new Date(Date.now() - 18000000).toISOString() },
];

export const INITIAL_MOCK_STATS = {
  id: 1,
  total_obstacles_destroyed: 48,
};

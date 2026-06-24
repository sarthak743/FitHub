export const user = {
  name: 'Arjun Sharma',
  handle: '@arjun.fit',
  avatar: null,
  height: '5\'10"',
  weight: '78 kg',
  goal: 'Build Muscle + Lose Fat',
  level: 'Intermediate',
  joinDate: 'Jan 2025',
  streak: 12,
  totalWorkouts: 87,
  weeklyTarget: 5,
};

export const progressData = {
  steps: [
    { day: 'Mon', value: 8200 },
    { day: 'Tue', value: 10500 },
    { day: 'Wed', value: 7800 },
    { day: 'Thu', value: 11200 },
    { day: 'Fri', value: 9600 },
    { day: 'Sat', value: 12400 },
    { day: 'Sun', value: 6300 },
  ],
  calories: [
    { day: 'Mon', value: 1820 },
    { day: 'Tue', value: 2100 },
    { day: 'Wed', value: 1950 },
    { day: 'Thu', value: 2240 },
    { day: 'Fri', value: 1780 },
    { day: 'Sat', value: 2050 },
    { day: 'Sun', value: 1600 },
  ],
  weight: [
    { week: 'W1', value: 80.2 },
    { week: 'W2', value: 79.8 },
    { week: 'W3', value: 79.1 },
    { week: 'W4', value: 78.5 },
    { week: 'W5', value: 78.0 },
    { week: 'W6', value: 77.6 },
  ],
  today: {
    steps: 8400,
    stepsGoal: 10000,
    calories: 1820,
    caloriesGoal: 2200,
    protein: 112,
    proteinGoal: 150,
  }
};

export const workoutHistory = [
  {
    id: 1,
    name: 'Upper Body Strength',
    date: 'Today, 7:30 AM',
    duration: '42 min',
    exercises: ['Push-ups', 'Pull-ups', 'Shoulder Press'],
    reps: 186,
    calories: 340,
    formScore: 91,
    tags: ['strength', 'upper'],
  },
  {
    id: 2,
    name: 'HIIT Cardio',
    date: 'Yesterday, 6:15 AM',
    duration: '28 min',
    exercises: ['Burpees', 'Jump Squats', 'Mountain Climbers'],
    reps: 240,
    calories: 410,
    formScore: 84,
    tags: ['cardio', 'hiit'],
  },
  {
    id: 3,
    name: 'Leg Day',
    date: 'Jun 18, 8:00 AM',
    duration: '55 min',
    exercises: ['Squats', 'Lunges', 'Deadlifts'],
    reps: 210,
    calories: 480,
    formScore: 78,
    tags: ['strength', 'legs'],
  },
  {
    id: 4,
    name: 'Core & Mobility',
    date: 'Jun 17, 7:00 AM',
    duration: '35 min',
    exercises: ['Plank', 'Crunches', 'Russian Twist'],
    reps: 160,
    calories: 260,
    formScore: 95,
    tags: ['core', 'mobility'],
  },
  {
    id: 5,
    name: 'Push Day',
    date: 'Jun 16, 6:45 AM',
    duration: '48 min',
    exercises: ['Bench Press', 'Tricep Dips', 'Lateral Raises'],
    reps: 198,
    calories: 370,
    formScore: 88,
    tags: ['strength', 'push'],
  },
];

export const exercises = [
  { id: 1, name: 'Push-ups', muscle: 'Chest / Triceps', difficulty: 'Beginner', targetReps: 15, sets: 3 },
  { id: 2, name: 'Squats', muscle: 'Quads / Glutes', difficulty: 'Beginner', targetReps: 20, sets: 3 },
  { id: 3, name: 'Pull-ups', muscle: 'Back / Biceps', difficulty: 'Intermediate', targetReps: 10, sets: 3 },
  { id: 4, name: 'Deadlift', muscle: 'Posterior Chain', difficulty: 'Advanced', targetReps: 8, sets: 4 },
  { id: 5, name: 'Plank Hold', muscle: 'Core', difficulty: 'Beginner', targetReps: 60, sets: 3, unit: 'sec' },
  { id: 6, name: 'Lunges', muscle: 'Quads / Hamstrings', difficulty: 'Beginner', targetReps: 12, sets: 3 },
];

export const goals = [
  { id: 1, label: 'Daily Steps', current: 8400, target: 10000, unit: 'steps', type: 'daily', color: 'cyan' },
  { id: 2, label: 'Protein Intake', current: 112, target: 150, unit: 'g', type: 'daily', color: 'violet' },
  { id: 3, label: 'Weekly Workouts', current: 3, target: 5, unit: 'sessions', type: 'weekly', color: 'green' },
  { id: 4, label: 'Calorie Target', current: 1820, target: 2200, unit: 'kcal', type: 'daily', color: 'amber' },
];

export const aiMessages = [
  {
    role: 'assistant',
    content: "Hey Arjun! I'm your AI fitness coach. Ask me anything about workouts, nutrition, form correction, or recovery. I've got your back. 💪",
    timestamp: '9:00 AM',
  },
];

export const suggestedPrompts = [
  "How much protein should I eat today?",
  "Suggest a beginner leg workout",
  "How can I improve my push-up form?",
  "I ate paneer and rice — is that good?",
  "Why does my squat feel unstable?",
  "How do I increase my daily steps?",
];

export const weeklyStreak = [
  { day: 'M', done: true },
  { day: 'T', done: true },
  { day: 'W', done: true },
  { day: 'T', done: true },
  { day: 'F', done: false },
  { day: 'S', done: false },
  { day: 'S', done: false },
];

// src/data/exerciseData.js
const exercises = [
  {
    id: 1,
    name: 'Bench Press',
    muscleGroup: 'Chest',
    type: 'Strength',
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    description: 'Compound press that builds chest, shoulders, and triceps.',
    gifUrl: 'https://d205bpvrqc9yn1.cloudfront.net/0025.gif', // Barbell Bench Press
    youtubeLink: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    musclesWorked: ['Pectoralis Major', 'Anterior Deltoid', 'Triceps Brachii'],
    instructions: [
      'Lie flat on a bench with feet planted.',
      'Grip the barbell slightly wider than shoulder-width.',
      'Unrack the bar and lower it to your lower chest.',
      'Press the bar back up to full arm extension.',
      'Repeat for desired reps.'
    ],
    formTips: [
      'Keep your shoulders retracted and depressed.',
      'Drive through your heels for stability.',
      'Don’t bounce the bar off your chest.'
    ],
    commonMistakes: [
      'Flaring elbows out too wide.',
      'Lifting hips off the bench.',
      'Uneven bar path.'
    ]
  },
  {
    id: 2,
    name: 'Squat',
    muscleGroup: 'Legs',
    type: 'Strength',
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    description: 'Foundational lower-body exercise for strength and mass.',
    gifUrl: 'https://d205bpvrqc9yn1.cloudfront.net/1461.gif', // Barbell Full Squat
    youtubeLink: 'https://www.youtube.com/watch?v=U3HlEF_E9fo',
    musclesWorked: ['Quadriceps', 'Hamstrings', 'Glutes', 'Core'],
    instructions: [
      'Set the barbell on your upper back (not neck).',
      'Stand with feet shoulder-width apart.',
      'Brace your core and descend as if sitting back.',
      'Go below parallel (thighs parallel to floor).',
      'Drive through your heels to stand up.'
    ],
    formTips: [
      'Keep your chest up and back straight.',
      'Knees should track over toes.',
      'Maintain a neutral spine.'
    ],
    commonMistakes: [
      'Letting knees cave inward.',
      'Rounding the lower back.',
      'Heels lifting off the ground.'
    ]
  },
  {
    id: 3,
    name: 'Deadlift',
    muscleGroup: 'Back',
    type: 'Strength',
    difficulty: 'Advanced',
    equipment: 'Barbell',
    description: 'Full-body pull that targets the posterior chain.',
    gifUrl: 'https://d205bpvrqc9yn1.cloudfront.net/0032.gif', // Barbell Deadlift
    youtubeLink: 'https://www.youtube.com/watch?v=1ZXobu7JvvE',
    musclesWorked: ['Hamstrings', 'Glutes', 'Lower Back', 'Traps'],
    instructions: [
      'Stand with mid-foot under the barbell.',
      'Bend at hips and knees, grip the bar just outside legs.',
      'Lift your chest, straighten your back.',
      'Pull the bar up by extending hips and knees simultaneously.',
      'Lock out at the top, then lower under control.'
    ],
    formTips: [
      'Keep the bar close to your shins.',
      'Engage lats by squeezing armpits.',
      'Don’t jerk the weight off the floor.'
    ],
    commonMistakes: [
      'Rounding the back.',
      'Starting with hips too low.',
      'Leaning back excessively at lockout.'
    ]
  },
  {
    id: 4,
    name: 'Pull-Up',
    muscleGroup: 'Back',
    type: 'Bodyweight',
    difficulty: 'Intermediate',
    equipment: 'Pull-Up Bar',
    description: 'Upper-body bodyweight exercise for back and biceps.',
    gifUrl: 'https://d205bpvrqc9yn1.cloudfront.net/0005.gif', // Pull-Up
    youtubeLink: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    musclesWorked: ['Lats', 'Biceps', 'Rear Delts'],
    instructions: [
      'Hang from a bar with palms facing away.',
      'Pull your shoulder blades down and back.',
      'Pull your body up until chin clears the bar.',
      'Lower with control to full extension.',
      'Repeat.'
    ],
    formTips: [
      'Avoid kipping or swinging.',
      'Squeeze your glutes for stability.',
      'Control the negative.'
    ],
    commonMistakes: [
      'Using too much momentum.',
      'Not achieving full range of motion.',
      'Elbow flare causing shoulder strain.'
    ]
  },
  {
    id: 5,
    name: 'Bicep Curl',
    muscleGroup: 'Arms',
    type: 'Strength',
    difficulty: 'Beginner',
    equipment: 'Dumbbells',
    description: 'Isolation exercise for the biceps.',
    gifUrl: 'https://d205bpvrqc9yn1.cloudfront.net/0306.gif', // Dumbbell Bicep Curl
    youtubeLink: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    musclesWorked: ['Biceps Brachii', 'Brachialis'],
    instructions: [
      'Stand holding dumbbells at your sides, palms forward.',
      'Keep elbows pinned to your torso.',
      'Curl the weights up while contracting biceps.',
      'Lower slowly to starting position.',
      'Repeat.'
    ],
    formTips: [
      'Do not swing the weights.',
      'Full range of motion – fully extend at bottom.',
      'Squeeze at the top of the movement.'
    ],
    commonMistakes: [
      'Using momentum from the back.',
      'Partial reps.',
      'Elbows drifting forward.'
    ]
  },
  {
  id: 6,
  name: 'Shoulder Press',
  muscleGroup: 'Shoulders',
  type: 'Strength',
  difficulty: 'Intermediate',
  equipment: 'Dumbbells',
  description: 'Compound shoulder exercise for building strength and size.',
  gifUrl: 'https://d205bpvrqc9yn1.cloudfront.net/0405.gif', // Dumbbell Seated Shoulder Press
  youtubeLink: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
  musclesWorked: ['Anterior Deltoid', 'Lateral Deltoid', 'Triceps'],
  instructions: [
    'Sit or stand holding dumbbells at shoulder height.',
    'Brace your core and keep your back neutral.',
    'Press the dumbbells overhead until arms are extended.',
    'Lower under control back to shoulder level.',
    'Repeat for desired reps.'
  ],
  formTips: [
    'Avoid arching your lower back.',
    'Keep wrists stacked over elbows.',
    'Control the lowering phase.'
  ],
  commonMistakes: [
    'Using excessive momentum.',
    'Locking elbows aggressively.',
    'Shrugging shoulders during the press.'
  ]
},
{
  id: 7,
  name: 'Lat Pulldown',
  muscleGroup: 'Back',
  type: 'Strength',
  difficulty: 'Beginner',
  equipment: 'Cable Machine',
  description: 'Machine exercise for developing the lats and upper back.',
  gifUrl: 'https://d205bpvrqc9yn1.cloudfront.net/0177.gif', // Cable Lat Pulldown
  youtubeLink: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
  musclesWorked: ['Latissimus Dorsi', 'Biceps', 'Rhomboids'],
  instructions: [
    'Grip the bar slightly wider than shoulder width.',
    'Sit with thighs secured beneath the pads.',
    'Pull the bar to your upper chest.',
    'Squeeze your shoulder blades together.',
    'Slowly return to the starting position.'
  ],
  formTips: [
    'Lead with your elbows.',
    'Keep your chest up.',
    'Control the eccentric movement.'
  ],
  commonMistakes: [
    'Pulling the bar behind the neck.',
    'Swinging your body.',
    'Using too much weight.'
  ]
},
{
  id: 8,
  name: 'Plank',
  muscleGroup: 'Core',
  type: 'Bodyweight',
  difficulty: 'Beginner',
  equipment: 'None',
  description: 'Core stability exercise that strengthens the entire midsection.',
  gifUrl: 'https://d205bpvrqc9yn1.cloudfront.net/0722.gif', // Plank
  youtubeLink: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
  musclesWorked: ['Rectus Abdominis', 'Obliques', 'Lower Back'],
  instructions: [
    'Place forearms on the floor.',
    'Extend your legs behind you.',
    'Keep your body in a straight line.',
    'Brace your core and glutes.',
    'Hold for the target duration.'
  ],
  formTips: [
    'Do not let your hips sag.',
    'Keep your neck neutral.',
    'Breathe normally.'
  ],
  commonMistakes: [
    'Raising the hips too high.',
    'Holding your breath.',
    'Letting the lower back arch.'
  ]
}
];

export { exercises };
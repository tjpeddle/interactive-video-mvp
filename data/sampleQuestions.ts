export const sampleQuestions = [
  {
    id: 'q1',
    timestamp: 10,
    question: 'What type of animal is Big Buck Bunny?',
    options: [
      { id: 'q1-a', text: 'A squirrel', correct: false },
      { id: 'q1-b', text: 'A rabbit', correct: true },
      { id: 'q1-c', text: 'A bird', correct: false },
      { id: 'q1-d', text: 'A butterfly', correct: false },
    ],
    feedback: {
      correct: 'Correct! Big Buck Bunny is a large rabbit.',
      incorrect: 'Not quite. Look at the main character more closely.',
    },
  },
  {
    id: 'q2',
    timestamp: 30,
    question: 'What is the setting of this scene?',
    options: [
      { id: 'q2-a', text: 'A city', correct: false },
      { id: 'q2-b', text: 'A forest', correct: true },
      { id: 'q2-c', text: 'A desert', correct: false },
      { id: 'q2-d', text: 'An ocean', correct: false },
    ],
    feedback: {
      correct: 'Yes! The scene takes place in a forest.',
      incorrect: 'Look at the trees and vegetation around the character.',
    },
  },
  {
    id: 'q3',
    timestamp: 50,
    question: 'What activity is happening in this clip?',
    options: [
      { id: 'q3-a', text: 'Flying', correct: false },
      { id: 'q3-b', text: 'Swimming', correct: false },
      { id: 'q3-c', text: 'Exploring nature', correct: true },
      { id: 'q3-d', text: 'Racing', correct: false },
    ],
    feedback: {
      correct: 'Excellent observation! The characters are exploring their natural environment.',
      incorrect: 'Watch what the characters are doing in their surroundings.',
    },
  },
];
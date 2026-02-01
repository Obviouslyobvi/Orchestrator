export const taskBenchmarks = {
  'Brainstorming / Idea Generation': {
    indexes: [{ key: 'intelligence_index', weight: 1 }],
    label: 'Intelligence Index'
  },
  'Writing / Copywriting': {
    indexes: [{ key: 'intelligence_index', weight: 1 }],
    label: 'Intelligence Index'
  },
  'Editing / Simplifying Text': {
    indexes: [{ key: 'intelligence_index', weight: 1 }],
    label: 'Intelligence Index'
  },
  'Code Writing': {
    indexes: [{ key: 'coding_index', weight: 1 }],
    label: 'Coding Index'
  },
  'Code Debugging': {
    indexes: [
      { key: 'coding_index', weight: 0.6 },
      { key: 'livecodebench', weight: 0.4 }
    ],
    label: 'Coding Index + LiveCodeBench'
  },
  'Research / Fact-Finding': {
    indexes: [{ key: 'intelligence_index', weight: 1 }],
    label: 'Intelligence Index'
  },
  'Data Analysis / Summarization': {
    indexes: [
      { key: 'intelligence_index', weight: 0.6 },
      { key: 'math_index', weight: 0.4 }
    ],
    label: 'Intelligence Index + Math Index'
  },
  'Creative Storytelling': {
    indexes: [{ key: 'intelligence_index', weight: 1 }],
    label: 'Intelligence Index'
  },
  'SEO / Marketing Copy': {
    indexes: [{ key: 'intelligence_index', weight: 1 }],
    label: 'Intelligence Index'
  },
  'Technical Documentation': {
    indexes: [
      { key: 'intelligence_index', weight: 0.6 },
      { key: 'coding_index', weight: 0.4 }
    ],
    label: 'Intelligence Index + Coding Index'
  },
  'Image Generation': {
    indexes: [{ key: 'image_elo', weight: 1 }],
    label: 'Text-to-Image ELO'
  },
  'Custom Step': {
    indexes: [{ key: 'intelligence_index', weight: 1 }],
    label: 'Intelligence Index'
  }
};

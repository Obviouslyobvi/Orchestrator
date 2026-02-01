export const modelRoutingRules = [
  {
    type: 'Brainstorming / Idea Generation',
    model: 'ChatGPT',
    reason: 'Strongest at creative divergent thinking.'
  },
  {
    type: 'Writing / Copywriting',
    model: 'Claude',
    reason: 'Best at tone, nuance, and long-form writing.'
  },
  {
    type: 'Editing / Simplifying Text',
    model: 'Claude',
    reason: 'Strongest at rewriting and clarity.'
  },
  {
    type: 'Code Writing',
    model: 'ChatGPT (Codex)',
    reason: 'Best for sustained code generation.'
  },
  {
    type: 'Code Debugging',
    model: 'Gemini',
    reason: 'Strong at identifying bugs and errors.'
  },
  {
    type: 'Research / Fact-Finding',
    model: 'Perplexity',
    reason: 'Built for real-time web research.'
  },
  {
    type: 'Data Analysis / Summarization',
    model: 'Gemini',
    reason: 'Strong at processing and summarizing large inputs.'
  },
  {
    type: 'Creative Storytelling',
    model: 'ChatGPT',
    reason: 'Best at narrative and creative fiction.'
  },
  {
    type: 'SEO / Marketing Copy',
    model: 'ChatGPT',
    reason: 'Strong at optimizing for audience and keywords.'
  },
  {
    type: 'Technical Documentation',
    model: 'Claude',
    reason: 'Best at structured, precise technical writing.'
  }
];

export const modelBadgeColors = {
  ChatGPT: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  'ChatGPT (Codex)': 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  Claude: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  Gemini: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  DeepSeek: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
  Perplexity: 'bg-pink-500/20 text-pink-400 border-pink-500/40',
  Grok: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
};

export const modelIcons = {
  ChatGPT: '🟠',
  'ChatGPT (Codex)': '🟠',
  Claude: '🟢',
  Gemini: '🔵',
  DeepSeek: '🟣',
  Perplexity: '🩷',
  Grok: '🟡'
};

export const getModelRouting = (taskType) => {
  return (
    modelRoutingRules.find((rule) => rule.type === taskType) ||
    modelRoutingRules[0]
  );
};

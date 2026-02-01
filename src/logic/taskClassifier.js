export const defaultSteps = [
  {
    title: 'Brainstorm the core concept',
    taskType: 'Brainstorming / Idea Generation'
  },
  {
    title: 'Draft the main copy',
    taskType: 'Writing / Copywriting'
  },
  {
    title: 'Refine tone and clarity',
    taskType: 'Editing / Simplifying Text'
  },
  {
    title: 'Outline marketing positioning',
    taskType: 'SEO / Marketing Copy'
  },
  {
    title: 'Summarize next actions',
    taskType: 'Data Analysis / Summarization'
  }
];

export const classifySteps = (projectDescription) => {
  if (!projectDescription) {
    return defaultSteps;
  }
  return defaultSteps;
};

import { buildProjectSteps } from '../logic/promptGenerator';
import { baselineRankings } from './baselineRankings';

export const initialProjects = [
  {
    id: 'p-001',
    name: 'Launch Page for Nova SaaS',
    description: 'Create a dark-mode landing page and copy for a SaaS productivity tool.',
    status: 'In Progress',
    favorite: true,
    steps: buildProjectSteps({
      projectName: 'Launch Page for Nova SaaS',
      projectDescription: 'Create a dark-mode landing page and copy for a SaaS productivity tool.',
      leaderboard: baselineRankings,
      excludedModels: [],
      memoryItems: []
    }),
    activeStepId: 'step-1'
  },
  {
    id: 'p-002',
    name: 'AI Newsletter Series',
    description: 'Plan a 5-issue email series introducing AI productivity tips.',
    status: 'Paused',
    favorite: false,
    steps: buildProjectSteps({
      projectName: 'AI Newsletter Series',
      projectDescription: 'Plan a 5-issue email series introducing AI productivity tips.',
      leaderboard: baselineRankings,
      excludedModels: [],
      memoryItems: []
    }),
    activeStepId: 'step-1'
  }
];

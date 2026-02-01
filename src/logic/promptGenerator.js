import { pickBestModel } from './modelRouter';
import { classifySteps } from './taskClassifier';
import { injectMemoryContext } from './memoryInjector';

export const buildPrompt = ({
  projectName,
  projectDescription,
  stepTitle,
  taskType,
  modelName,
  memoryItems
}) => {
  const basePrompt = `Project: ${projectName}\nGoal: ${projectDescription}\n\nStep: ${stepTitle}\nTask type: ${taskType}\nModel guidance: ${modelName}\n\nPlease provide your best response for this step. Use bullet points when helpful and keep it ready to paste into the orchestrator.`;
  return injectMemoryContext({
    prompt: basePrompt,
    memoryItems,
    projectName,
    taskType
  });
};

export const buildProjectSteps = ({
  projectName,
  projectDescription,
  leaderboard,
  excludedModels = [],
  memoryItems = []
}) => {
  const steps = classifySteps(projectDescription);
  return steps.map((step, index) => {
    const routing = pickBestModel({
      taskType: step.taskType,
      rankings: leaderboard,
      excludedModels
    });
    return {
      id: `step-${index + 1}`,
      title: step.title,
      taskType: step.taskType,
      model: routing.model,
      reason: routing.reason,
      score: routing.score,
      indexLabel: routing.indexLabel,
      status: index === 0 ? 'Active' : 'Pending',
      prompt: buildPrompt({
        projectName,
        projectDescription,
        stepTitle: step.title,
        taskType: step.taskType,
        modelName: routing.model,
        memoryItems
      }),
      response: ''
    };
  });
};

export const createCustomStep = ({
  title,
  model,
  projectName,
  projectDescription,
  memoryItems = []
}) => {
  return {
    id: `step-${Math.random().toString(36).slice(2, 9)}`,
    title,
    taskType: 'Custom Step',
    model,
    reason: 'Custom model selection based on your preference.',
    score: null,
    indexLabel: 'Manual override',
    status: 'Pending',
    prompt: buildPrompt({
      projectName,
      projectDescription,
      stepTitle: title,
      taskType: 'Custom Step',
      modelName: model,
      memoryItems
    }),
    response: ''
  };
};

export const injectMemoryContext = ({ prompt, memoryItems, projectName, taskType }) => {
  if (!memoryItems || memoryItems.length === 0) {
    return prompt;
  }

  const relevant = memoryItems.filter((item) => {
    const tags = item.tags || (item.tag ? [item.tag] : []);
    if (!tags || tags.length === 0) {
      return true;
    }
    const projectTag = `project:${projectName?.toLowerCase()}`;
    return (
      tags.some((tag) => tag.toLowerCase() === projectTag) ||
      tags.some((tag) => tag.toLowerCase().includes('preference')) ||
      tags.some((tag) => tag.toLowerCase().includes(taskType.toLowerCase()))
    );
  });

  if (relevant.length === 0) {
    return prompt;
  }

  const memoryBlock = relevant
    .map((item) => `- ${item.title}: ${item.content}`)
    .join('\n');

  return `${prompt}\n\nContext from your memory:\n${memoryBlock}`;
};

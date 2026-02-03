import { GoogleGenerativeAI } from '@google/generative-ai';

const buildPrompt = (companyName: string) => `
You are assisting with contact enrichment for a California data broker database.
Provide research notes for the company "${companyName}".
Include likely CEO or decision-maker names, titles, and recommended next steps.
If you are unsure, provide best-guess suggestions and note uncertainty.
`.trim();

export const requestResearch = async (companyName: string) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY environment variable.');
  }
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(buildPrompt(companyName));
  return result.response.text();
};

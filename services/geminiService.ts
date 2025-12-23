import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateIssueDescription = async (title: string, type: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";
  
  try {
    const model = ai.models;
    const prompt = `You are a project manager assistant for a construction and infrastructure company called Hutama Karya. 
    Write a professional and detailed description for a Jira ticket with the title: "${title}" and type: "${type}".
    Include Acceptance Criteria and potential technical considerations. Keep it concise but useful.`;

    const response = await model.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try again.";
  }
};

export const suggestSubtasks = async (description: string): Promise<string[]> => {
  if (!apiKey) return [];
  
  try {
    const model = ai.models;
    const prompt = `Based on this task description, suggest 3-5 subtasks to break it down. Return ONLY a JSON array of strings. 
    Description: ${description}`;

    const response = await model.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

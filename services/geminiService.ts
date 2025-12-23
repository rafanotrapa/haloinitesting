import { GoogleGenerativeAI } from "@google/generative-ai";

// @ts-ignore - Mengabaikan error TS karena Vite tetap bisa baca import.meta.env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const generateIssueDescription = async (title: string, type: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a project manager assistant for Hutama Karya. 
    Write a detailed description for a Jira ticket: "${title}" and type: "${type}".`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description.";
  }
};
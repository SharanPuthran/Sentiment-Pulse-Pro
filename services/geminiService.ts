import { GoogleGenAI, Type } from "@google/genai";
import { DashboardReport } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeReviews = async (rawText: string, categoryFilter?: string): Promise<DashboardReport> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const filterContext = categoryFilter ? `FOCUS ONLY ON THE CATEGORY: "${categoryFilter}".` : "";

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `You are monitoring live feedback for ETIHAD AIRWAYS. 
    Analyze the following batch of reviews across multi-channel social sources and provide a structured JSON report. 
    ${filterContext}
    1. Executive Summary: Summarize the current vibe of the guest experience.
    2. Actionable Areas: Identify top 3 issues specific to Etihad's premium service (Lounge at AUH, Cabin Crew, The Residence/First class, Business class, Guest services).
    3. Sentiment Trend: Plot a chronological series of scores.
    4. Keyword Cloud: Extract prominent luxury and service terms.
    5. Categories: Group feedback into: 'First/Business Class', 'Economy Experience', 'Etihad Guest (Loyalty)', 'Airport/Lounge Services', 'Crew Performance'.

    Reviews Batch:
    ${rawText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          actionableAreas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
              },
              required: ["title", "description", "impact"]
            }
          },
          sentimentTrend: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                score: { type: Type.NUMBER },
                label: { type: Type.STRING }
              },
              required: ["date", "score", "label"]
            }
          },
          wordCloud: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                value: { type: Type.NUMBER },
                sentiment: { type: Type.STRING, enum: ["praise", "complaint"] }
              },
              required: ["text", "value", "sentiment"]
            }
          },
          categories: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sentimentScore: { type: Type.NUMBER },
                summary: { type: Type.STRING },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["name", "sentimentScore", "summary", "keywords"]
            }
          }
        },
        required: ["executiveSummary", "actionableAreas", "sentimentTrend", "wordCloud", "categories"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const getChatResponse = async (
  prompt: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  useThinking: boolean = false
) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const config: any = {
    systemInstruction: "You are an expert aviation guest-experience analyst for Etihad Airways. Assist with deep-dive analysis of premium service feedback.",
  };
  if (useThinking) {
    config.thinkingConfig = { thinkingBudget: 32768 };
  }
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
    config
  });
  return response.text;
};
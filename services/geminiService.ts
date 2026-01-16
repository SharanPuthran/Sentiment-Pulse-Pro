import { GoogleGenAI, Type } from "@google/genai";
import { DashboardReport } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeReviews = async (rawText: string, categoryFilter?: string): Promise<DashboardReport> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const filterContext = categoryFilter ? `FOCUS ONLY ON THE CATEGORY: "${categoryFilter}".` : "";

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `You are monitoring live feedback for INDIGO AIRLINES. 
    Analyze the following batch of reviews across multi-channel social sources (Google, Reddit, Yelp, Facebook, LinkedIn, Twitter) and provide a structured JSON report. 
    ${filterContext}
    1. Executive Summary: Summarize the current operational performance and guest sentiment.
    2. Actionable Areas: Identify top 3 issues specific to Indigo's low-cost carrier model (On-time performance, Ground staff, Cabin comfort, Web Check-in, Pricing/Refunds).
    3. Sentiment Trend: Plot a chronological series of scores (-1 to 1).
    4. Keyword Cloud: Extract prominent operational and service terms.
    5. Categories: Group feedback into: 'Ground Operations', 'In-Flight Service', 'Booking & Tech', 'Baggage & Logistics', 'Punctuality'.

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
    systemInstruction: "You are an expert operational analyst for Indigo Airlines. You help internal teams understand guest sentiment and operational efficiency from social feed data.",
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
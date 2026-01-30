
import { GoogleGenAI, Type } from "@google/genai";
import { AISlideConfig } from "../types";

// Always use process.env.API_KEY directly and use named parameter for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSlideContent = async (config: AISlideConfig) => {
  const prompt = `Generate a slide layout for a digital signage screen. 
    Topic: ${config.topic}
    Business Type: ${config.businessType}
    Style: ${config.style}
    Return the layout as JSON containing title, subtitle, main message, call to action, and hex color codes for background and text.`;

  // Use recommended model for basic text/layout tasks.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          mainMessage: { type: Type.STRING },
          cta: { type: Type.STRING },
          backgroundColor: { type: Type.STRING },
          textColor: { type: Type.STRING },
          accentColor: { type: Type.STRING }
        },
        required: ["title", "mainMessage", "backgroundColor", "textColor"]
      }
    }
  });

  // Access the .text property directly (not a method) and handle potential undefined.
  return JSON.parse(response.text || "{}");
};

export const suggestSchedule = async (businessType: string) => {
  const prompt = `Suggest a morning (8AM-12PM), afternoon (12PM-5PM), and evening (5PM-10PM) content strategy for a digital signage display at a ${businessType}. Return short titles and descriptions for each block.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            timeBlock: { type: Type.STRING },
            suggestion: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["timeBlock", "suggestion"]
        }
      }
    }
  });

  // Access the .text property directly (not a method) and handle potential undefined.
  return JSON.parse(response.text || "[]");
};

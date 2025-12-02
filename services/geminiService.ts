import { GoogleGenAI, Type } from "@google/genai";
import { Book } from "../types";

const apiKey = process.env.API_KEY || ''; // In a real app, ensure this is set
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key is present
const isAiEnabled = () => !!apiKey;

export const generateBookMetadata = async (title: string, author: string) => {
  if (!isAiEnabled()) {
    console.warn("Gemini API Key missing");
    return null;
  }

  try {
    const prompt = `Generate a compelling book description (approx 80 words), a list of 5 relevant tags, and a genre category for a book titled "${title}" by "${author}". Return JSON.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Metadata generation failed:", error);
    return null;
  }
};

export const getBookRecommendations = async (query: string, availableBooks: Book[]) => {
  if (!isAiEnabled()) return [];

  // Create a context string of available books
  const booksContext = availableBooks.map(b => 
    `ID: ${b.id}, Title: ${b.title}, Author: ${b.author}, Category: ${b.category}`
  ).join('\n');

  const prompt = `
    Based on the user's request: "${query}", recommend up to 3 books from the following list.
    Only select books that truly match.
    
    List of Available Books:
    ${booksContext}

    Return JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  bookId: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text).recommendations;
  } catch (error) {
    console.error("AI Recommendation failed:", error);
    return [];
  }
};

export const chatWithAI = async (message: string, history: string[]) => {
  if (!isAiEnabled()) return "I'm sorry, my AI brain is currently offline (API Key missing).";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        You are a helpful bookstore assistant named "BookSphere AI".
        Previous conversation:
        ${history.join('\n')}
        
        User: ${message}
        
        Answer politely and concisely. If asked for recommendations, suggest general genres or ask for preferences.
      `
    });
    return response.text;
  } catch (error) {
    return "I'm having trouble connecting to the server right now.";
  }
};

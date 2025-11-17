import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateLearningContent = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a helpful research assistant. Find relevant, high-quality articles and YouTube videos about the user's topic: "${topic}". Your response must be a valid JSON object only, without any surrounding text or markdown formatting. The JSON object should have two top-level keys: "articles" and "videos". The "articles" key should be an array of objects, where each object has "title" (string), "link" (string), and "snippet" (string). The "videos" key should be an array of objects, where each object has "title" (string), "link" (string), and "description" (string). If you cannot find relevant results, return an empty array for the corresponding key.`,
        config: {
            tools: [{googleSearch: {}}],
        }
    });
    
    let jsonString = response.text.trim();
    
    // The model might still wrap the JSON in markdown backticks, so let's clean that up.
    if (jsonString.startsWith('```json')) {
        jsonString = jsonString.substring(7);
        if (jsonString.endsWith('```')) {
            jsonString = jsonString.substring(0, jsonString.length - 3);
        }
    }

    // It's possible the model returns a non-JSON string on failure, so we wrap in a try-catch
    try {
        const parsed = JSON.parse(jsonString);
        // Ensure the response has the expected structure
        if (typeof parsed === 'object' && parsed !== null) {
            return {
                articles: Array.isArray(parsed.articles) ? parsed.articles : [],
                videos: Array.isArray(parsed.videos) ? parsed.videos : [],
            };
        }
        throw new Error("Parsed JSON is not in the expected format.");
    } catch(e) {
        console.error("Failed to parse JSON response from Gemini:", jsonString);
        throw new Error("The model returned an invalid response. Please try again.");
    }

  } catch (error) {
    console.error("Error generating content:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error("Invalid API Key. Please check your configuration.");
    }
    throw new Error("Failed to generate content. Please check your API key and network connection.");
  }
};
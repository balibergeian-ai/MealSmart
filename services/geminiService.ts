
import { GoogleGenAI, Type } from "@google/genai";
import { AnalyzedFood, UserProfile, DailyTotals } from '../types';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const model = "gemini-2.5-flash";

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: "A descriptive name for the food item or meal.",
        },
        calories: {
            type: Type.NUMBER,
            description: "Estimated total calories for the item.",
        },
        protein: {
            type: Type.NUMBER,
            description: "Estimated grams of protein.",
        },
        carbohydrates: {
            type: Type.NUMBER,
            description: "Estimated grams of carbohydrates.",
        },
        fat: {
            type: Type.NUMBER,
            description: "Estimated grams of fat.",
        },
    },
    required: ["name", "calories", "protein", "carbohydrates", "fat"],
};

const getAnalysis = async (promptParts: any[]): Promise<{ data: AnalyzedFood | null; error: string | null; }> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: { parts: promptParts },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText) as AnalyzedFood;
        return { data, error: null };

    } catch (error) {
        console.error("Error analyzing food with Gemini API:", error);
        if (error instanceof Error) {
            if (error.message.includes('SAFETY')) {
                 return { data: null, error: "The request was blocked due to safety settings. Please try a different input." };
            }
            return { data: null, error: "The AI model could not process the request. Please try again." };
        }
        return { data: null, error: "An unknown error occurred during analysis." };
    }
};

export const analyzeFoodFromText = async (description: string): Promise<{ data: AnalyzedFood | null; error: string | null; }> => {
    const prompt = `Analyze the following meal description and provide its nutritional information. Description: ${description}`;
    return getAnalysis([{ text: prompt }]);
};

export const analyzeFoodFromImage = async (imageFile: File): Promise<{ data: AnalyzedFood | null; error: string | null; }> => {
    try {
        const base64Image = await fileToBase64(imageFile);
        const imagePart = {
            inlineData: {
                mimeType: imageFile.type,
                data: base64Image,
            },
        };
        const textPart = {
            text: "Analyze the food in this image and provide its estimated nutritional information.",
        };

        return getAnalysis([imagePart, textPart]);
    } catch (error) {
        console.error("Error processing image file:", error);
        return { data: null, error: "Could not process the image file. Please try a different image." };
    }
};

export const getHealthTip = async (profile: UserProfile, totals: DailyTotals): Promise<{ data: string | null; error: string | null; }> => {
    const prompt = `
        You are a friendly and encouraging nutrition coach. Based on the following user profile and their food intake for today, provide one short, actionable, and positive tip.
        The user wants to feel motivated. Do not be harsh or critical. Keep the tip under 60 words.

        User Profile:
        - Gender: ${profile.gender}
        - Age: ${profile.age}
        - Calorie Goal: ${profile.goals.calories} kcal
        - Protein Goal: ${profile.goals.protein} g

        Today's Intake:
        - Calories: ${Math.round(totals.calories)} kcal
        - Protein: ${Math.round(totals.protein)} g
        - Carbs: ${Math.round(totals.carbs)} g
        - Fat: ${Math.round(totals.fat)} g

        Your tip:
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                temperature: 0.7,
            },
        });
        return { data: response.text, error: null };
    } catch (error) {
        console.error("Error getting health tip from Gemini API:", error);
        if (error instanceof Error) {
            if (error.message.includes('SAFETY')) {
                 return { data: null, error: "The request for a tip was blocked due to safety settings." };
            }
            return { data: null, error: "The AI model could not generate a tip. Please try again." };
        }
        return { data: null, error: "An unknown error occurred while getting a tip." };
    }
};

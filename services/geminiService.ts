
import { GoogleGenAI, Type } from "@google/genai";
import { AnalyzedFood } from '../types';

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

const getAnalysis = async (promptParts: any[]): Promise<AnalyzedFood | null> => {
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
        return data;

    } catch (error) {
        console.error("Error analyzing food with Gemini API:", error);
        return null;
    }
};

export const analyzeFoodFromText = async (description: string): Promise<AnalyzedFood | null> => {
    const prompt = `Analyze the following meal description and provide its nutritional information. Description: ${description}`;
    return getAnalysis([{ text: prompt }]);
};

export const analyzeFoodFromImage = async (imageFile: File): Promise<AnalyzedFood | null> => {
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
};

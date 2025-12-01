
import { AnalyzedFood } from '../types';

// This is a mock database. In a real application, this would be an API call.
const foodDatabase: AnalyzedFood[] = [
    { name: 'Apple (medium)', calories: 95, protein: 0.5, carbohydrates: 25, fat: 0.3 },
    { name: 'Banana (medium)', calories: 105, protein: 1.3, carbohydrates: 27, fat: 0.4 },
    { name: 'Chicken Breast (100g, cooked)', calories: 165, protein: 31, carbohydrates: 0, fat: 3.6 },
    { name: 'Salmon (100g, cooked)', calories: 206, protein: 22, carbohydrates: 0, fat: 12 },
    { name: 'Broccoli (1 cup)', calories: 55, protein: 3.7, carbohydrates: 11.2, fat: 0.6 },
    { name: 'Brown Rice (1 cup, cooked)', calories: 216, protein: 5, carbohydrates: 45, fat: 1.8 },
    { name: 'Quinoa (1 cup, cooked)', calories: 222, protein: 8, carbohydrates: 39, fat: 3.6 },
    { name: 'Avocado (half)', calories: 160, protein: 2, carbohydrates: 9, fat: 15 },
    { name: 'Almonds (28g, ~23 nuts)', calories: 164, protein: 6, carbohydrates: 6, fat: 14 },
    { name: 'Egg (large)', calories: 78, protein: 6, carbohydrates: 0.6, fat: 5 },
    { name: 'Greek Yogurt (100g, plain, non-fat)', calories: 59, protein: 10, carbohydrates: 3.6, fat: 0.4 },
    { name: 'Oatmeal (1 cup, cooked)', calories: 158, protein: 6, carbohydrates: 27, fat: 3.2 },
    { name: 'Whole Wheat Bread (1 slice)', calories: 81, protein: 4, carbohydrates: 13.8, fat: 1.1 },
    { name: 'Peanut Butter (2 tbsp)', calories: 191, protein: 7, carbohydrates: 7, fat: 16 },
    { name: 'Olive Oil (1 tbsp)', calories: 119, protein: 0, carbohydrates: 0, fat: 13.5 },
    { name: 'Sweet Potato (medium, baked)', calories: 103, protein: 2.3, carbohydrates: 23.6, fat: 0.2 },
    { name: 'Spinach (1 cup, raw)', calories: 7, protein: 0.9, carbohydrates: 1.1, fat: 0.1 },
    { name: 'Lentils (1 cup, cooked)', calories: 230, protein: 18, carbohydrates: 40, fat: 0.8 },
    { name: 'Tofu (100g)', calories: 76, protein: 8, carbohydrates: 1.9, fat: 4.8 },
    { name: 'Milk (1 cup, 2%)', calories: 122, protein: 8, carbohydrates: 12, fat: 4.8 },
    // Filipino Foods
    { name: 'Chicken Adobo (1 cup)', calories: 350, protein: 30, carbohydrates: 10, fat: 20 },
    { name: 'Pork Sinigang (1 cup)', calories: 280, protein: 20, carbohydrates: 15, fat: 15 },
    { name: 'Lechon Kawali (100g)', calories: 550, protein: 25, carbohydrates: 0, fat: 50 },
    { name: 'Pancit Canton (1 cup)', calories: 400, protein: 15, carbohydrates: 50, fat: 15 },
    { name: 'Lumpia Shanghai (5 pieces)', calories: 300, protein: 15, carbohydrates: 25, fat: 15 },
    { name: 'Kare-Kare (1 cup)', calories: 450, protein: 25, carbohydrates: 20, fat: 30 },
    { name: 'Pork Sisig (1 cup)', calories: 600, protein: 20, carbohydrates: 5, fat: 55 },
    { name: 'Bicol Express (1 cup)', calories: 400, protein: 25, carbohydrates: 10, fat: 30 },
    { name: 'Halo-Halo (1 serving)', calories: 450, protein: 5, carbohydrates: 80, fat: 10 },
    { name: 'White Rice (1 cup, cooked)', calories: 205, protein: 4.3, carbohydrates: 45, fat: 0.4 },
    // Filipino Fast Food
    { name: 'Jollibee Chickenjoy (1pc)', calories: 320, protein: 20, carbohydrates: 15, fat: 20 },
    { name: 'Jollibee Jolly Spaghetti', calories: 300, protein: 10, carbohydrates: 50, fat: 8 },
    { name: 'Jollibee Yumburger', calories: 250, protein: 10, carbohydrates: 28, fat: 11 },
    { name: "McDonald's Chicken McDo (1pc)", calories: 280, protein: 22, carbohydrates: 13, fat: 16 },
    { name: "McDonald's McSpaghetti", calories: 310, protein: 9, carbohydrates: 53, fat: 7 },
    { name: "Chowking Chao Fan (Pork)", calories: 500, protein: 15, carbohydrates: 80, fat: 13 },
];

export const searchFoodDatabase = (query: string): Promise<AnalyzedFood[]> => {
    return new Promise(resolve => {
        // Simulate network delay
        setTimeout(() => {
            if (!query) {
                resolve([]);
                return;
            }
            const lowercasedQuery = query.toLowerCase();
            const results = foodDatabase.filter(item =>
                item.name.toLowerCase().includes(lowercasedQuery)
            );
            resolve(results);
        }, 300); 
    });
};
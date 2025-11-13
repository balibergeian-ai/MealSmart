
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export type DailyLog = Record<MealCategory, FoodItem[]>;

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailyGoals extends DailyTotals {}

export interface AnalyzedFood {
    name: string;
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
}

export interface UserProfile {
  name: string;
  age: number | '';
  weight: number | ''; // in kg
  height: number | ''; // in cm
  gender: 'male' | 'female' | 'other';
  goals: DailyGoals;
}

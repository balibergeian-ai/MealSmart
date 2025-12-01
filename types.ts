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
  avatarUrl?: string;
}

// Social Features
export interface SocialUser {
  id: string;
  name: string;
  avatarUrl?: string; // URL to user's profile picture
}

export interface Reaction {
  userId: string;
  emoji: string; // e.g., '👍', '🔥', '🎉'
}

export interface Comment {
  id: string;
  author: SocialUser;
  timestamp: string;
  text: string;
}

export interface Post {
  id: string;
  author: SocialUser;
  timestamp: string;
  message: string;
  dailySummary: DailyTotals;
  reactions: Reaction[];
  comments: Comment[];
  likes: string[]; // Array of user IDs who liked the post
}
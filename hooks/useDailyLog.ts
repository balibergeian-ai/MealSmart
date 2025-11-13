import { useState, useEffect, useCallback } from 'react';
import { DailyLog, FoodItem, MealCategory, DailyTotals } from '../types';

const getTodayKey = () => new Date().toISOString().split('T')[0];

const initialDailyLog: DailyLog = {
  Breakfast: [],
  Lunch: [],
  Dinner: [],
  Snacks: [],
};

export const useDailyLog = () => {
  const [dailyLog, setDailyLog] = useState<DailyLog>(initialDailyLog);
  const [totals, setTotals] = useState<DailyTotals>({ calories: 0, protein: 0, carbs: 0, fat: 0 });

  useEffect(() => {
    try {
      const todayKey = getTodayKey();
      const storedLog = localStorage.getItem(`dailyLog-${todayKey}`);
      if (storedLog) {
        setDailyLog(JSON.parse(storedLog));
      } else {
        // Clear log for a new day
        setDailyLog(initialDailyLog);
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
      setDailyLog(initialDailyLog);
    }
  }, []);

  useEffect(() => {
    try {
      const todayKey = getTodayKey();
      localStorage.setItem(`dailyLog-${todayKey}`, JSON.stringify(dailyLog));
    } catch (error) {
      console.error("Failed to save to localStorage", error);
    }

    // Fix: Explicitly type the accumulator `acc` and iterated `item` to help TypeScript
    // correctly infer their types and avoid errors when accessing their properties.
    const newTotals = Object.values(dailyLog).flat().reduce((acc: DailyTotals, item: FoodItem) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    setTotals(newTotals);

  }, [dailyLog]);

  const addFoodItem = useCallback((category: MealCategory, food: Omit<FoodItem, 'id'>) => {
    const newFoodItem: FoodItem = { ...food, id: new Date().toISOString() };
    setDailyLog(prevLog => ({
      ...prevLog,
      [category]: [...prevLog[category], newFoodItem],
    }));
  }, []);

  const removeFoodItem = useCallback((category: MealCategory, foodId: string) => {
    setDailyLog(prevLog => ({
      ...prevLog,
      [category]: prevLog[category].filter(item => item.id !== foodId),
    }));
  }, []);

  return { dailyLog, addFoodItem, removeFoodItem, totals };
};

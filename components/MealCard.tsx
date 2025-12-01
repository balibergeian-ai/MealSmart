import React from 'react';
import { FoodItem, MealCategory } from '../types';
import { XIcon } from './icons/XIcon';

interface MealCardProps {
  category: MealCategory;
  foodItems: FoodItem[];
  onRemoveFood: (category: MealCategory, foodId: string) => void;
}

const MealCard: React.FC<MealCardProps> = ({ category, foodItems, onRemoveFood }) => {
  const totalCalories = foodItems.reduce((sum, item) => sum + item.calories, 0);

  return (
    <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-off-white">{category}</h3>
        <span className="text-slate-500 dark:text-slate-400 font-medium">{Math.round(totalCalories)} kcal</span>
      </div>
      {foodItems.length > 0 ? (
        <ul className="space-y-3">
          {foodItems.map(item => (
            <li key={item.id} className="flex justify-between items-start">
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300">{item.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {Math.round(item.calories)} kcal &bull; P:{Math.round(item.protein)}g C:{Math.round(item.carbs)}g F:{Math.round(item.fat)}g
                </p>
              </div>
              <button onClick={() => onRemoveFood(category, item.id)} className="text-slate-400 dark:text-slate-500 hover:text-red-500 p-1">
                <XIcon className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400 dark:text-slate-500 text-center py-4">No items logged yet.</p>
      )}
    </div>
  );
};

export default MealCard;
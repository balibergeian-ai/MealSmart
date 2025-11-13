
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
    <div className="bg-white p-4 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-xl font-semibold">{category}</h3>
        <span className="text-slate-500 font-medium">{Math.round(totalCalories)} kcal</span>
      </div>
      {foodItems.length > 0 ? (
        <ul className="space-y-3">
          {foodItems.map(item => (
            <li key={item.id} className="flex justify-between items-start">
              <div>
                <p className="font-medium text-slate-700">{item.name}</p>
                <p className="text-sm text-slate-500">
                  {Math.round(item.calories)} kcal &bull; P:{Math.round(item.protein)}g C:{Math.round(item.carbs)}g F:{Math.round(item.fat)}g
                </p>
              </div>
              <button onClick={() => onRemoveFood(category, item.id)} className="text-slate-400 hover:text-red-500 p-1">
                <XIcon className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400 text-center py-4">No items logged yet.</p>
      )}
    </div>
  );
};

export default MealCard;

import React from 'react';
import { DailyLog, DailyTotals, DailyGoals, MealCategory } from '../types';
import CircularProgress from './CircularProgress';
import MealCard from './MealCard';

interface DashboardProps {
  dailyLog: DailyLog;
  totals: DailyTotals;
  goals: DailyGoals;
  onRemoveFood: (category: MealCategory, foodId: string) => void;
}

const MacroDisplay: React.FC<{ label: string; value: number; goal: number; color: string }> = ({ label, value, goal, color }) => (
  <div className="flex-1 text-center">
    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    <p className="text-lg font-semibold text-slate-800 dark:text-off-white">{Math.round(value)}g</p>
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
      <div className={`${color} h-2 rounded-full`} style={{ width: `${Math.min((value / goal) * 100, 100)}%` }}></div>
    </div>
    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Goal: {goal}g</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ dailyLog, totals, goals, onRemoveFood }) => {
  const caloriesRemaining = goals.calories - totals.calories;
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Summary Section */}
      <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
        <div className="relative">
          <CircularProgress percentage={(totals.calories / goals.calories) * 100} size={140} strokeWidth={12} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-dark-cyan">{Math.round(totals.calories)}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">kcal eaten</span>
          </div>
        </div>
        <div className="w-full flex-1">
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-off-white md:text-left">
            {caloriesRemaining >= 0 ? `${Math.round(caloriesRemaining)} kcal remaining` : `${Math.abs(Math.round(caloriesRemaining))} kcal over`}
          </h2>
          <div className="mt-4 flex justify-between space-x-4">
            <MacroDisplay label="Protein" value={totals.protein} goal={goals.protein} color="bg-sky-500" />
            <MacroDisplay label="Carbs" value={totals.carbs} goal={goals.carbs} color="bg-amber-500" />
            <MacroDisplay label="Fat" value={totals.fat} goal={goals.fat} color="bg-rose-500" />
          </div>
        </div>
      </div>

      {/* Meals Section */}
      <div className="space-y-6">
        {(Object.keys(dailyLog) as MealCategory[]).map(category => (
          <MealCard 
            key={category}
            category={category}
            foodItems={dailyLog[category]}
            onRemoveFood={onRemoveFood}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
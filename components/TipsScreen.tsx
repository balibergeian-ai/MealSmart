import React, { useState } from 'react';
import { UserProfile, DailyTotals } from '../types';
import { getHealthTip } from '../services/geminiService';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface TipsScreenProps {
  userProfile: UserProfile;
  dailyTotals: DailyTotals;
}

const TipsScreen: React.FC<TipsScreenProps> = ({ userProfile, dailyTotals }) => {
  const [tip, setTip] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetTip = async () => {
    setIsLoading(true);
    setError(null);
    setTip(null);
    const { data, error: apiError } = await getHealthTip(userProfile, dailyTotals);
    if (data) {
      setTip(data);
    } else {
      setError(apiError || "Sorry, we couldn't generate a tip right now. Please try again later.");
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in flex flex-col items-center text-center">
      <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-md w-full max-w-2xl">
        <div className="flex flex-col items-center gap-4">
            <LightbulbIcon className="w-16 h-16 text-amber-400" />
            <h2 className="text-3xl font-bold text-slate-800 dark:text-off-white">AI-Powered Tips</h2>
            <p className="text-slate-500 dark:text-slate-400">
                Get a personalized health and nutrition tip based on your goals and today's progress.
            </p>
        </div>

        <div className="mt-8">
            <button
                onClick={handleGetTip}
                disabled={isLoading}
                className="w-full max-w-xs mx-auto bg-dark-cyan text-white font-bold py-3 px-6 rounded-lg hover:bg-light-cyan transition disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Generating...
                    </>
                ) : (
                    "Get Today's Tip"
                )}
            </button>
        </div>
        
        <div className="mt-8 min-h-[100px] flex items-center justify-center">
            {tip && (
                 <div className="bg-slate-100 dark:bg-slate-900/70 p-4 rounded-lg animate-fade-in w-full">
                    <p className="text-slate-700 dark:text-slate-300 text-lg">{tip}</p>
                 </div>
            )}
            {error && (
                <p className="text-red-500">{error}</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default TipsScreen;

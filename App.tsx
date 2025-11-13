
import React, { useState } from 'react';
import { useDailyLog } from './hooks/useDailyLog';
import { useUserProfile } from './hooks/useUserProfile';
import Dashboard from './components/Dashboard';
import AddMealModal from './components/AddMealModal';
import ProfileScreen from './components/ProfileScreen';
import ProfileSetupWizard from './components/ProfileSetupWizard';
import { PlusIcon } from './components/icons/PlusIcon';
import { UserIcon } from './components/icons/UserIcon';
import { HomeIcon } from './components/icons/HomeIcon';

type View = 'dashboard' | 'profile';

const App: React.FC = () => {
  const { dailyLog, addFoodItem, removeFoodItem, totals } = useDailyLog();
  const { userProfile, updateUserProfile, isProfileSetup, completeProfileSetup } = useUserProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<View>('dashboard');

  if (isProfileSetup) {
    return <ProfileSetupWizard onComplete={completeProfileSetup} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">MealSmart</h1>
          <nav>
            {view === 'dashboard' ? (
              <button 
                onClick={() => setView('profile')} 
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-green-600 transition-colors"
                aria-label="View Profile"
              >
                <UserIcon className="w-7 h-7" />
              </button>
            ) : (
              <button 
                onClick={() => setView('dashboard')} 
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-green-600 transition-colors"
                aria-label="View Dashboard"
              >
                <HomeIcon className="w-7 h-7" />
              </button>
            )}
          </nav>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' ? (
          <Dashboard 
            dailyLog={dailyLog}
            totals={totals}
            goals={userProfile.goals}
            onRemoveFood={removeFoodItem}
          />
        ) : (
          <ProfileScreen
            userProfile={userProfile}
            onSave={updateUserProfile}
          />
        )}
      </main>

      {view === 'dashboard' && (
        <div className="fixed bottom-6 right-6 z-20">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-110"
            aria-label="Add Meal"
          >
            <PlusIcon className="w-8 h-8" />
          </button>
        </div>
      )}

      <AddMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddFood={addFoodItem}
      />
    </div>
  );
};

export default App;

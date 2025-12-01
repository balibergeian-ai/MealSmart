import React, { useState } from 'react';
import { useDailyLog } from './hooks/useDailyLog';
import { useUserProfile } from './hooks/useUserProfile';
import { useTheme } from './hooks/useTheme';
import Dashboard from './components/Dashboard';
import AddMealModal from './components/AddMealModal';
import ProfileScreen from './components/ProfileScreen';
import ProfileSetupWizard from './components/ProfileSetupWizard';
import CommunityFeed from './components/CommunityFeed';
import TipsScreen from './components/TipsScreen';
import { PlusIcon } from './components/icons/PlusIcon';
import { UserIcon } from './components/icons/UserIcon';
import { HomeIcon } from './components/icons/HomeIcon';
import { UsersIcon } from './components/icons/UsersIcon';
import { LightbulbIcon } from './components/icons/LightbulbIcon';
import { DumbbellIcon } from './components/icons/DumbbellIcon';

type View = 'dashboard' | 'community' | 'profile' | 'tips';

const App: React.FC = () => {
  const { dailyLog, addFoodItem, removeFoodItem, totals } = useDailyLog();
  const { userProfile, updateUserProfile, isProfileSetup, completeProfileSetup } = useUserProfile();
  const { theme, toggleTheme } = useTheme();
  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);
  const [view, setView] = useState<View>('dashboard');

  if (isProfileSetup) {
    return <ProfileSetupWizard onComplete={completeProfileSetup} />;
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard 
                  dailyLog={dailyLog}
                  totals={totals}
                  goals={userProfile.goals}
                  onRemoveFood={removeFoodItem}
                />;
      case 'community':
        return <CommunityFeed userProfile={userProfile} dailyTotals={totals} />;
      case 'profile':
        return <ProfileScreen
                  userProfile={userProfile}
                  onSave={updateUserProfile}
                  theme={theme}
                  toggleTheme={toggleTheme}
                />;
      case 'tips':
        return <TipsScreen userProfile={userProfile} dailyTotals={totals} />;
      default:
        return null;
    }
  };

  const NavItem: React.FC<{ activeView: View; view: View; label: string; onClick: () => void; children: React.ReactNode }> = ({ activeView, view, label, onClick, children }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${activeView === view ? 'text-dark-cyan' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-off-white'}`}>
      {children}
      <span className="text-xs">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-very-dark-blue text-slate-800 dark:text-off-white pb-24">
      <header className="bg-slate-100/80 dark:bg-very-dark-blue/80 backdrop-blur-sm shadow-md dark:shadow-black/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <DumbbellIcon className="w-8 h-8 text-dark-cyan" />
            <h1 className="text-2xl font-bold text-dark-cyan">MealSmart</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-100/80 dark:bg-very-dark-blue/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700/50 shadow-lg z-20">
        <div className="max-w-4xl mx-auto flex justify-around items-center">
           <NavItem activeView={view} view="dashboard" label="Dashboard" onClick={() => setView('dashboard')}>
              <HomeIcon className="w-7 h-7" />
           </NavItem>
           <NavItem activeView={view} view="community" label="Community" onClick={() => setView('community')}>
              <UsersIcon className="w-7 h-7" />
           </NavItem>
           <div className="relative">
             <button
               onClick={() => setIsAddMealModalOpen(true)}
               className="bg-dark-cyan text-white rounded-full p-4 shadow-lg hover:bg-light-cyan focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-very-dark-blue focus:ring-dark-cyan transition-transform transform hover:scale-110 -mt-8 border-4 border-slate-100 dark:border-very-dark-blue"
               aria-label="Add Meal"
             >
               <PlusIcon className="w-8 h-8" />
             </button>
           </div>
           <NavItem activeView={view} view="tips" label="Tips" onClick={() => setView('tips')}>
              <LightbulbIcon className="w-7 h-7" />
           </NavItem>
           <NavItem activeView={view} view="profile" label="Profile" onClick={() => setView('profile')}>
              <UserIcon className="w-7 h-7" />
           </NavItem>
        </div>
      </div>


      <AddMealModal
        isOpen={isAddMealModalOpen}
        onClose={() => setIsAddMealModalOpen(false)}
        onAddFood={addFoodItem}
      />
    </div>
  );
};

export default App;
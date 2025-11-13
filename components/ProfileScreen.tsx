
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  userProfile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

const ProfileInput: React.FC<{ label: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; unit?: string; }> = ({ label, value, onChange, type = 'text', unit }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="w-full border-slate-300 rounded-md p-3 focus:ring-green-500 focus:border-green-500 transition"
            />
            {unit && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">{unit}</div>}
        </div>
    </div>
);

const ProfileSelect: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ label, value, onChange, children }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
             <select
                value={value}
                onChange={onChange}
                className="w-full border-slate-300 rounded-md p-3 focus:ring-green-500 focus:border-green-500 transition"
            >
                {children}
            </select>
        </div>
    </div>
);


const ProfileScreen: React.FC<ProfileScreenProps> = ({ userProfile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof UserProfile | keyof UserProfile['goals']) => {
    const { value } = e.target;
    const isGoal = ['calories', 'protein', 'carbs', 'fat'].includes(field as string);
    
    if (isGoal) {
        const numericValue = value === '' ? '' : parseFloat(value);
        setFormData(prev => ({
            ...prev,
            goals: {
                ...prev.goals,
                [field]: numericValue
            }
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            [field]: (field === 'name' || field === 'gender') ? value : (value === '' ? '' : parseFloat(value))
        }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const profileToSave: UserProfile = {
      ...formData,
      age: formData.age === '' ? 0 : Number(formData.age),
      weight: formData.weight === '' ? 0 : Number(formData.weight),
      height: formData.height === '' ? 0 : Number(formData.height),
      goals: {
        calories: formData.goals.calories === '' ? 0 : Number(formData.goals.calories),
        protein: formData.goals.protein === '' ? 0 : Number(formData.goals.protein),
        carbs: formData.goals.carbs === '' ? 0 : Number(formData.goals.carbs),
        fat: formData.goals.fat === '' ? 0 : Number(formData.goals.fat),
      }
    };

    onSave(profileToSave);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold text-slate-800">Your Profile</h2>
        <form onSubmit={handleSave} className="space-y-6">
            {/* Personal Details Card */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileInput label="Name" value={formData.name} onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'name')} />
                    <ProfileInput label="Age" value={formData.age} onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'age')} type="number" />
                    <ProfileSelect label="Gender" value={formData.gender} onChange={(e) => handleChange(e, 'gender')}>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                    </ProfileSelect>
                    <ProfileInput label="Weight" value={formData.weight} onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'weight')} type="number" unit="kg" />
                    <ProfileInput label="Height" value={formData.height} onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'height')} type="number" unit="cm" />
                </div>
            </div>

            {/* Daily Goals Card */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Daily Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileInput label="Calories" value={formData.goals.calories} onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'calories')} type="number" unit="kcal" />
                    <ProfileInput label="Protein" value={formData.goals.protein} onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'protein')} type="number" unit="g" />
                    <ProfileInput label="Carbs" value={formData.goals.carbs} onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'carbs')} type="number" unit="g" />
                    <ProfileInput label="Fat" value={formData.goals.fat} onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, 'fat')} type="number" unit="g" />
                </div>
            </div>
            
            <div className="flex justify-end">
                <button type="submit" className={`px-6 py-3 font-bold text-white rounded-md transition ${isSaved ? 'bg-green-500' : 'bg-green-600 hover:bg-green-700'}`}>
                    {isSaved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>
        </form>
    </div>
  );
};

export default ProfileScreen;

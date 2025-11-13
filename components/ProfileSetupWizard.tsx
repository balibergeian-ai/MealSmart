
import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';

interface ProfileSetupWizardProps {
    onComplete: (profile: UserProfile) => void;
}

const initialProfile: UserProfile = {
    name: '',
    age: '',
    gender: 'female',
    weight: '',
    height: '',
    goals: {
        calories: 2000,
        protein: 100,
        carbs: 250,
        fat: 65,
    },
};

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
type Goal = 'lose' | 'maintain' | 'gain';

const ProfileSetupWizard: React.FC<ProfileSetupWizardProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(initialProfile);
    const [activityLevel, setActivityLevel] = useState<ActivityLevel>('light');
    const [goal, setGoal] = useState<Goal>('maintain');

    const calculatedGoals = useMemo(() => {
        const { age, weight, height, gender } = formData;
        if (!age || !weight || !height) return initialProfile.goals;

        // Mifflin-St Jeor Equation for BMR
        let bmr = (10 * Number(weight)) + (6.25 * Number(height)) - (5 * Number(age));
        if (gender === 'male') {
            bmr += 5;
        } else {
            bmr -= 161;
        }

        const activityMultipliers: Record<ActivityLevel, number> = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            veryActive: 1.9,
        };

        let tdee = bmr * activityMultipliers[activityLevel];

        const goalAdjustments: Record<Goal, number> = {
            lose: -500,
            maintain: 0,
            gain: 300,
        };

        const finalCalories = Math.round(tdee + goalAdjustments[goal]);

        // Macronutrient calculation (example: 40% C, 30% P, 30% F)
        const carbs = Math.round((finalCalories * 0.4) / 4);
        const protein = Math.round((finalCalories * 0.3) / 4);
        const fat = Math.round((finalCalories * 0.3) / 9);

        return { calories: finalCalories, carbs, protein, fat };

    }, [formData.age, formData.weight, formData.height, formData.gender, activityLevel, goal]);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'name' || name === 'gender') ? value : (value === '' ? '' : parseFloat(value))
        }));
    };

    const handleFinish = () => {
        const finalProfile = {
            ...formData,
            age: Number(formData.age),
            weight: Number(formData.weight),
            height: Number(formData.height),
            goals: calculatedGoals,
        }
        onComplete(finalProfile);
    };

    const isStep1Valid = formData.name.trim() !== '';
    const isStep2Valid = formData.age !== '' && formData.weight !== '' && formData.height !== '' && Number(formData.age) > 0 && Number(formData.weight) > 0 && Number(formData.height) > 0;

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <h1 className="text-3xl font-bold text-center text-green-600">Welcome to MealSmart</h1>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(step / 4) * 100}%`, transition: 'width 0.3s ease-in-out' }}></div>
                </div>

                {/* Step 1: Name */}
                {step === 1 && (
                    <div className="space-y-4 animate-fade-in">
                        <h2 className="text-xl font-semibold text-center">Let's start with your name</h2>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 w-full border-slate-300 rounded-md p-3 focus:ring-green-500 focus:border-green-500 transition" placeholder="e.g., Alex Doe" />
                        </div>
                        <button onClick={handleNext} disabled={!isStep1Valid} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 transition disabled:bg-slate-400">Next</button>
                    </div>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                    <div className="space-y-4 animate-fade-in">
                        <h2 className="text-xl font-semibold text-center">Tell us about yourself</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Age</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} className="mt-1 w-full border-slate-300 rounded-md p-3 focus:ring-green-500 focus:border-green-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 w-full border-slate-300 rounded-md p-3 focus:ring-green-500 focus:border-green-500">
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Weight (kg)</label>
                                <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="mt-1 w-full border-slate-300 rounded-md p-3 focus:ring-green-500 focus:border-green-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Height (cm)</label>
                                <input type="number" name="height" value={formData.height} onChange={handleChange} className="mt-1 w-full border-slate-300 rounded-md p-3 focus:ring-green-500 focus:border-green-500" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleBack} className="w-full bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-md hover:bg-slate-300 transition">Back</button>
                            <button onClick={handleNext} disabled={!isStep2Valid} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 transition disabled:bg-slate-400">Next</button>
                        </div>
                    </div>
                )}

                {/* Step 3: Goals */}
                {step === 3 && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-semibold text-center">What's your primary goal?</h2>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-2">Activity Level</label>
                             <select value={activityLevel} onChange={e => setActivityLevel(e.target.value as ActivityLevel)} className="w-full border-slate-300 rounded-md p-3 focus:ring-green-500 focus:border-green-500">
                                 <option value="sedentary">Sedentary (little or no exercise)</option>
                                 <option value="light">Lightly active (light exercise/sports 1-3 days/week)</option>
                                 <option value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</option>
                                 <option value="active">Very active (hard exercise/sports 6-7 days a week)</option>
                                 <option value="veryActive">Extra active (very hard exercise/sports & physical job)</option>
                             </select>
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-slate-700 mb-2">Goal</label>
                             <div className="flex space-x-2">
                                {(['lose', 'maintain', 'gain'] as Goal[]).map(g => (
                                    <button key={g} onClick={() => setGoal(g)} className={`flex-1 p-2 rounded-md capitalize transition ${goal === g ? 'bg-green-600 text-white' : 'bg-slate-200 hover:bg-slate-300'}`}>{g} weight</button>
                                ))}
                             </div>
                        </div>
                         <div className="bg-slate-100 p-4 rounded-md text-center space-y-2">
                            <h3 className="font-semibold">Your Suggested Daily Goals:</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <div><span className="font-bold text-green-600">{calculatedGoals.calories}</span><p className="text-sm text-slate-500">kcal</p></div>
                                <div><span className="font-bold">{calculatedGoals.protein}g</span><p className="text-sm text-slate-500">Protein</p></div>
                                <div><span className="font-bold">{calculatedGoals.carbs}g</span><p className="text-sm text-slate-500">Carbs</p></div>
                                <div><span className="font-bold">{calculatedGoals.fat}g</span><p className="text-sm text-slate-500">Fat</p></div>
                            </div>
                            <p className="text-xs text-slate-400 pt-2">You can adjust these later in your profile.</p>
                         </div>
                        <div className="flex gap-4">
                            <button onClick={handleBack} className="w-full bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-md hover:bg-slate-300 transition">Back</button>
                            <button onClick={handleNext} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 transition">Next</button>
                        </div>
                    </div>
                )}
                
                {/* Step 4: Summary */}
                {step === 4 && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-semibold text-center">Ready to go?</h2>
                        <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                            <p><strong>Name:</strong> {formData.name}</p>
                            <p><strong>Age:</strong> {formData.age}</p>
                            <p><strong>Weight:</strong> {formData.weight} kg</p>
                            <p><strong>Height:</strong> {formData.height} cm</p>
                            <p className="font-semibold pt-2">Daily Goals:</p>
                            <p className="text-sm">
                                {calculatedGoals.calories} kcal, 
                                {calculatedGoals.protein}g Protein, 
                                {calculatedGoals.carbs}g Carbs, 
                                {calculatedGoals.fat}g Fat
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleBack} className="w-full bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-md hover:bg-slate-300 transition">Back</button>
                            <button onClick={handleFinish} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 transition">Finish Setup & Start Tracking!</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSetupWizard;

import React, { useState, useMemo, useRef } from 'react';
import { UserProfile } from '../types';
import Avatar from './Avatar';
import { PencilIcon } from './icons/PencilIcon';

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
    avatarUrl: undefined,
};

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
type Goal = 'lose' | 'maintain' | 'gain';

const ProfileSetupWizard: React.FC<ProfileSetupWizardProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(initialProfile);
    const [activityLevel, setActivityLevel] = useState<ActivityLevel>('light');
    const [goal, setGoal] = useState<Goal>('maintain');
    const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
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
        <div className="min-h-screen bg-slate-100 dark:bg-very-dark-blue flex flex-col items-center justify-center p-4 text-slate-800 dark:text-off-white">
            <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
                <h1 className="text-3xl font-bold text-center text-dark-cyan">Welcome to MealSmart</h1>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div className="bg-dark-cyan h-2.5 rounded-full" style={{ width: `${(step / 4) * 100}%`, transition: 'width 0.3s ease-in-out' }}></div>
                </div>

                {/* Step 1: Name & Avatar */}
                {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-semibold text-center">Let's get you set up</h2>
                        
                        <div className="flex justify-center">
                            <div className="relative">
                                <Avatar user={{ name: formData.name || '?', id: 'setupUser', avatarUrl: formData.avatarUrl }} size="lg" />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-2 -right-2 bg-dark-cyan text-white rounded-full p-2 shadow-md hover:bg-light-cyan transition"
                                    aria-label="Upload photo"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded-md p-3 focus:ring-dark-cyan focus:border-dark-cyan transition placeholder-slate-400 dark:placeholder-slate-500" placeholder="e.g., Alex Doe" />
                        </div>
                        <button onClick={handleNext} disabled={!isStep1Valid} className="w-full bg-dark-cyan text-white font-bold py-3 px-4 rounded-md hover:bg-light-cyan transition disabled:bg-slate-400 dark:disabled:bg-slate-600">Next</button>
                    </div>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                    <div className="space-y-4 animate-fade-in">
                        <h2 className="text-xl font-semibold text-center">Tell us about yourself</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Age</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} className="mt-1 w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded-md p-3 focus:ring-dark-cyan focus:border-dark-cyan" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded-md p-3 focus:ring-dark-cyan focus:border-dark-cyan">
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Weight (kg)</label>
                                <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="mt-1 w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded-md p-3 focus:ring-dark-cyan focus:border-dark-cyan" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Height (cm)</label>
                                <input type="number" name="height" value={formData.height} onChange={handleChange} className="mt-1 w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded-md p-3 focus:ring-dark-cyan focus:border-dark-cyan" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleBack} className="w-full bg-slate-500 dark:bg-slate-600 text-white dark:text-off-white font-bold py-3 px-4 rounded-md hover:bg-slate-600 dark:hover:bg-slate-500 transition">Back</button>
                            <button onClick={handleNext} disabled={!isStep2Valid} className="w-full bg-dark-cyan text-white font-bold py-3 px-4 rounded-md hover:bg-light-cyan transition disabled:bg-slate-400 dark:disabled:bg-slate-600">Next</button>
                        </div>
                    </div>
                )}

                {/* Step 3: Goals */}
                {step === 3 && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-semibold text-center">What's your primary goal?</h2>
                        <div>
                             <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Activity Level</label>
                             <select value={activityLevel} onChange={e => setActivityLevel(e.target.value as ActivityLevel)} className="w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded-md p-3 focus:ring-dark-cyan focus:border-dark-cyan">
                                 <option value="sedentary">Sedentary (little or no exercise)</option>
                                 <option value="light">Lightly active (light exercise/sports 1-3 days/week)</option>
                                 <option value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</option>
                                 <option value="active">Very active (hard exercise/sports 6-7 days a week)</option>
                                 <option value="veryActive">Extra active (very hard exercise/sports & physical job)</option>
                             </select>
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Goal</label>
                             <div className="flex space-x-2">
                                {(['lose', 'maintain', 'gain'] as Goal[]).map(g => (
                                    <button key={g} onClick={() => setGoal(g)} className={`flex-1 p-2 rounded-md capitalize transition ${goal === g ? 'bg-dark-cyan text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-off-white'}`}>{g} weight</button>
                                ))}
                             </div>
                        </div>
                         <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-md text-center space-y-2">
                            <h3 className="font-semibold">Your Suggested Daily Goals:</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <div><span className="font-bold text-dark-cyan">{calculatedGoals.calories}</span><p className="text-sm text-slate-500 dark:text-slate-400">kcal</p></div>
                                <div><span className="font-bold text-slate-800 dark:text-off-white">{calculatedGoals.protein}g</span><p className="text-sm text-slate-500 dark:text-slate-400">Protein</p></div>
                                <div><span className="font-bold text-slate-800 dark:text-off-white">{calculatedGoals.carbs}g</span><p className="text-sm text-slate-500 dark:text-slate-400">Carbs</p></div>
                                <div><span className="font-bold text-slate-800 dark:text-off-white">{calculatedGoals.fat}g</span><p className="text-sm text-slate-500 dark:text-slate-400">Fat</p></div>
                            </div>
                            <p className="text-xs text-slate-400 dark:text-slate-500 pt-2">You can adjust these later in your profile.</p>
                         </div>
                        <div className="flex gap-4">
                             <button onClick={handleBack} className="w-full bg-slate-500 dark:bg-slate-600 text-white dark:text-off-white font-bold py-3 px-4 rounded-md hover:bg-slate-600 dark:hover:bg-slate-500 transition">Back</button>
                            <button onClick={handleNext} className="w-full bg-dark-cyan text-white font-bold py-3 px-4 rounded-md hover:bg-light-cyan transition">Next</button>
                        </div>
                    </div>
                )}
                
                {/* Step 4: Summary */}
                {step === 4 && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-semibold text-center">Ready to go?</h2>
                        <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg space-y-2 text-slate-600 dark:text-slate-300">
                            <p><strong>Name:</strong> {formData.name}</p>
                            <p><strong>Age:</strong> {formData.age}</p>
                            <p><strong>Weight:</strong> {formData.weight} kg</p>
                            <p><strong>Height:</strong> {formData.height} cm</p>
                            <p className="font-semibold pt-2 text-slate-800 dark:text-off-white">Daily Goals:</p>
                            <p className="text-sm">
                                {calculatedGoals.calories} kcal, 
                                {calculatedGoals.protein}g Protein, 
                                {calculatedGoals.carbs}g Carbs, 
                                {calculatedGoals.fat}g Fat
                            </p>
                        </div>
                        <div className="flex gap-4">
                             <button onClick={handleBack} className="w-full bg-slate-500 dark:bg-slate-600 text-white dark:text-off-white font-bold py-3 px-4 rounded-md hover:bg-slate-600 dark:hover:bg-slate-500 transition">Back</button>
                            <button onClick={handleFinish} className="w-full bg-dark-cyan text-white font-bold py-3 px-4 rounded-md hover:bg-light-cyan transition">Finish Setup & Start Tracking!</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSetupWizard;
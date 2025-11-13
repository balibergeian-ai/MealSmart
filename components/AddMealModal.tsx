
import React, { useState, useRef, useCallback } from 'react';
import { FoodItem, MealCategory, AnalyzedFood } from '../types';
import { analyzeFoodFromText, analyzeFoodFromImage } from '../services/geminiService';
import { XIcon } from './icons/XIcon';
import { CameraIcon } from './icons/CameraIcon';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (category: MealCategory, food: Omit<FoodItem, 'id'>) => void;
}

type View = 'start' | 'loading' | 'confirm';

const AddMealModal: React.FC<AddMealModalProps> = ({ isOpen, onClose, onAddFood }) => {
  const [view, setView] = useState<View>('start');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzedFood, setAnalyzedFood] = useState<AnalyzedFood | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('Breakfast');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setView('start');
    setTextInput('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalyzedFood(null);
    setError(null);
    setSelectedCategory('Breakfast');
  }, []);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setTextInput(''); // Clear text input if file is selected
    }
  };

  const handleAnalyze = async () => {
    if (!textInput && !selectedFile) {
      setError('Please describe your meal or upload a photo.');
      return;
    }

    setView('loading');
    setError(null);
    let result: AnalyzedFood | null = null;
    if (selectedFile) {
      result = await analyzeFoodFromImage(selectedFile);
    } else {
      result = await analyzeFoodFromText(textInput);
    }

    if (result) {
      setAnalyzedFood(result);
      setView('confirm');
    } else {
      setError('Sorry, we couldn\'t analyze your meal. Please try again.');
      setView('start');
    }
  };

  const handleConfirmAdd = () => {
    if (analyzedFood) {
      const foodToAdd = {
        name: analyzedFood.name,
        calories: analyzedFood.calories,
        protein: analyzedFood.protein,
        carbs: analyzedFood.carbohydrates,
        fat: analyzedFood.fat,
      };
      onAddFood(selectedCategory, foodToAdd);
      handleClose();
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-6 relative">
          <h2 className="text-2xl font-bold text-center mb-4">Add a Meal</h2>
          <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <XIcon className="w-6 h-6" />
          </button>
          
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          {view === 'start' && (
            <div className="space-y-4">
              <textarea
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                placeholder="e.g., 'A bowl of oatmeal with blueberries and a coffee'"
                className="w-full border-slate-300 rounded-md p-3 focus:ring-green-500 focus:border-green-500 transition"
                rows={3}
                disabled={!!selectedFile}
              />
              <div className="text-center text-slate-500">OR</div>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-md p-4 text-slate-500 hover:border-green-500 hover:text-green-600 transition">
                <CameraIcon className="w-6 h-6" />
                <span>Upload a Photo</span>
              </button>
              {previewUrl && (
                <div className="relative mt-4">
                  <img src={previewUrl} alt="Meal preview" className="rounded-md max-h-48 w-full object-cover" />
                  <button onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white">
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              <button onClick={handleAnalyze} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 transition">
                Analyze Meal
              </button>
            </div>
          )}
          
          {view === 'loading' && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-slate-500">Analyzing your meal with AI...</p>
            </div>
          )}

          {view === 'confirm' && analyzedFood && (
            <div className="space-y-4">
              <div className="bg-slate-100 p-4 rounded-md">
                <h3 className="font-bold text-lg">{analyzedFood.name}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-center">
                  <div><span className="font-bold text-green-600">{Math.round(analyzedFood.calories)}</span><p className="text-sm text-slate-500">kcal</p></div>
                  <div><span className="font-bold">{Math.round(analyzedFood.protein)}g</span><p className="text-sm text-slate-500">Protein</p></div>
                  <div><span className="font-bold">{Math.round(analyzedFood.carbohydrates)}g</span><p className="text-sm text-slate-500">Carbs</p></div>
                  <div><span className="font-bold">{Math.round(analyzedFood.fat)}g</span><p className="text-sm text-slate-500">Fat</p></div>
                </div>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Add to:</label>
                <select id="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value as MealCategory)} className="w-full border-slate-300 rounded-md focus:ring-green-500 focus:border-green-500">
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                  <option>Snacks</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setView('start')} className="w-full bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-md hover:bg-slate-300 transition">
                  Go Back
                </button>
                <button onClick={handleConfirmAdd} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 transition">
                  Confirm & Add
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AddMealModal;

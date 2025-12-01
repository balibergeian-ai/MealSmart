import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FoodItem, MealCategory, AnalyzedFood } from '../types';
import { analyzeFoodFromText, analyzeFoodFromImage } from '../services/geminiService';
import { searchFoodDatabase } from '../services/foodSearchService';
import { XIcon } from './icons/XIcon';
import { CameraIcon } from './icons/CameraIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { SearchIcon } from './icons/SearchIcon';
import { PencilIcon } from './icons/PencilIcon';


interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (category: MealCategory, food: Omit<FoodItem, 'id'>) => void;
}

type View = 'start' | 'loading' | 'confirm';
type ActiveTab = 'analyze' | 'search' | 'manual';

const AddMealModal: React.FC<AddMealModalProps> = ({ isOpen, onClose, onAddFood }) => {
  const [view, setView] = useState<View>('start');
  const [activeTab, setActiveTab] = useState<ActiveTab>('analyze');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzedFood, setAnalyzedFood] = useState<AnalyzedFood | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('Breakfast');
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AnalyzedFood[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    name: '',
    calories: '',
    protein: '',
    carbohydrates: '',
    fat: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setView('start');
    setActiveTab('analyze');
    setTextInput('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalyzedFood(null);
    setError(null);
    setSelectedCategory('Breakfast');
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setIsDragging(false);
    setManualEntry({
      name: '',
      calories: '',
      protein: '',
      carbohydrates: '',
      fat: '',
    });
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(() => {
      searchFoodDatabase(searchQuery).then(results => {
        setSearchResults(results);
        setIsSearching(false);
      });
    }, 300); // Debounce search

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);


  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileSelect = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setTextInput(''); // Clear text input if file is selected
      setError(null);
    } else if (file) {
      setError("Please upload a valid image file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files?.[0] || null);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedFile) setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!selectedFile) {
        handleFileSelect(e.dataTransfer.files?.[0] || null);
    }
  };

  const handleAnalyze = async () => {
    if (!textInput && !selectedFile) {
      setError('Please describe your meal or upload a photo.');
      return;
    }

    setView('loading');
    setError(null);
    
    const { data: result, error: apiError } = selectedFile
      ? await analyzeFoodFromImage(selectedFile)
      : await analyzeFoodFromText(textInput);

    if (result) {
      setAnalyzedFood(result);
      setView('confirm');
    } else {
      setError(apiError || 'Sorry, we couldn\'t analyze your meal. Please try again.');
      setView('start');
    }
  };

  const handleSelectSearchResult = (food: AnalyzedFood) => {
    setAnalyzedFood(food);
    setView('confirm');
  };
  
  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManualEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleAddManualEntry = () => {
    if (!manualEntry.name || !manualEntry.calories) {
      setError('Please enter at least a name and calories.');
      return;
    }
    setError(null);
    const foodData: AnalyzedFood = {
      name: manualEntry.name,
      calories: Number(manualEntry.calories) || 0,
      protein: Number(manualEntry.protein) || 0,
      carbohydrates: Number(manualEntry.carbohydrates) || 0,
      fat: Number(manualEntry.fat) || 0,
    };
    setAnalyzedFood(foodData);
    setView('confirm');
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

  const TabButton: React.FC<{ tab: ActiveTab; label: string; icon: React.ReactNode }> = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex items-center justify-center gap-2 p-3 font-semibold transition border-b-2 ${activeTab === tab ? 'border-dark-cyan text-dark-cyan' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-off-white'}`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-6 relative">
          <h2 className="text-2xl font-bold text-center mb-4 text-slate-800 dark:text-off-white">Add a Meal</h2>
          <button onClick={handleClose} className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
            <XIcon className="w-6 h-6" />
          </button>
          
          {error && <p className="text-red-500 text-center mb-4 animate-fade-in">{error}</p>}
          
          {view === 'start' && (
            <>
              <div className="flex border-b border-slate-200 dark:border-slate-700 mb-4">
                  <TabButton tab="analyze" label="Analyze" icon={<SparklesIcon className="w-5 h-5" />} />
                  <TabButton tab="search" label="Search" icon={<SearchIcon className="w-5 h-5" />} />
                  <TabButton tab="manual" label="Manual" icon={<PencilIcon className="w-5 h-5" />} />
              </div>
              
              {activeTab === 'analyze' && (
                <div className="space-y-4 animate-fade-in">
                  <textarea
                    value={textInput}
                    onChange={(e) => {
                      setTextInput(e.target.value);
                      if (selectedFile) {
                         setSelectedFile(null);
                         setPreviewUrl(null);
                         if(fileInputRef.current) fileInputRef.current.value = "";
                      }
                    }}
                    placeholder="e.g., 'A bowl of oatmeal with blueberries and a coffee'"
                    className="w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded-md p-3 focus:ring-dark-cyan focus:border-dark-cyan transition text-slate-800 dark:text-off-white placeholder-slate-400 dark:placeholder-slate-500"
                    rows={3}
                    disabled={!!selectedFile}
                  />
                  <div className="text-center text-slate-400 dark:text-slate-500">OR</div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                  {!previewUrl ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-md p-8 text-slate-500 dark:text-slate-400 transition cursor-pointer ${isDragging ? 'border-dark-cyan bg-dark-cyan/10 dark:bg-dark-cyan/20' : 'border-slate-300 dark:border-slate-600 hover:border-dark-cyan hover:text-dark-cyan'}`}
                    >
                      <CameraIcon className="w-8 h-8" />
                      <span>Click to Upload a Photo</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">or drag and drop</span>
                    </div>
                  ) : (
                    <div className="relative mt-4">
                      <img src={previewUrl} alt="Meal preview" className="rounded-md max-h-48 w-full object-cover" />
                      <button onClick={() => { 
                          setSelectedFile(null); 
                          setPreviewUrl(null); 
                          if(fileInputRef.current) fileInputRef.current.value = "";
                      }} className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-75 transition">
                        <XIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <button onClick={handleAnalyze} className="w-full bg-dark-cyan text-white font-bold py-3 px-4 rounded-md hover:bg-light-cyan transition disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!textInput && !selectedFile}>
                    Analyze Meal
                  </button>
                </div>
              )}

              {activeTab === 'search' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for a food..."
                      className="w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded-md p-3 pl-10 focus:ring-dark-cyan focus:border-dark-cyan transition text-slate-800 dark:text-off-white placeholder-slate-400 dark:placeholder-slate-500"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-400" />
                  </div>
                  <div className="h-64 overflow-y-auto pr-2">
                    {isSearching && <p className="text-center text-slate-500 dark:text-slate-400 py-4">Searching...</p>}
                    {!isSearching && searchResults.length > 0 && (
                      <ul className="space-y-2">
                        {searchResults.map((item) => (
                          <li key={item.name} onClick={() => handleSelectSearchResult(item)} className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md hover:bg-dark-cyan/20 dark:hover:bg-dark-cyan/30 cursor-pointer transition">
                            <p className="font-semibold text-slate-800 dark:text-off-white">{item.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{Math.round(item.calories)} kcal</p>
                          </li>
                        ))}
                      </ul>
                    )}
                    {!isSearching && searchQuery && searchResults.length === 0 && <p className="text-center text-slate-400 dark:text-slate-500 py-4">No results found.</p>}
                  </div>
                </div>
              )}

              {activeTab === 'manual' && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-sm text-center text-slate-500 dark:text-slate-400">Log a food item by entering its nutritional information directly.</p>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Food Name</label>
                      <input type="text" name="name" id="name" value={manualEntry.name} onChange={handleManualChange} placeholder="e.g., Homemade Sandwich" className="mt-1 w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded-md p-2 focus:ring-dark-cyan focus:border-dark-cyan text-slate-800 dark:text-off-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="calories" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Calories (kcal)</label>
                        <input type="number" name="calories" id="calories" value={manualEntry.calories} onChange={handleManualChange} className="mt-1 w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded-md p-2 focus:ring-dark-cyan focus:border-dark-cyan text-slate-800 dark:text-off-white" />
                      </div>
                      <div>
                        <label htmlFor="protein" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Protein (g)</label>
                        <input type="number" name="protein" id="protein" value={manualEntry.protein} onChange={handleManualChange} className="mt-1 w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded-md p-2 focus:ring-dark-cyan focus:border-dark-cyan text-slate-800 dark:text-off-white" />
                      </div>
                      <div>
                        <label htmlFor="carbohydrates" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Carbs (g)</label>
                        <input type="number" name="carbohydrates" id="carbohydrates" value={manualEntry.carbohydrates} onChange={handleManualChange} className="mt-1 w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded-md p-2 focus:ring-dark-cyan focus:border-dark-cyan text-slate-800 dark:text-off-white" />
                      </div>
                      <div>
                        <label htmlFor="fat" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Fat (g)</label>
                        <input type="number" name="fat" id="fat" value={manualEntry.fat} onChange={handleManualChange} className="mt-1 w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded-md p-2 focus:ring-dark-cyan focus:border-dark-cyan text-slate-800 dark:text-off-white" />
                      </div>
                    </div>
                  </div>
                  <button onClick={handleAddManualEntry} className="w-full bg-dark-cyan text-white font-bold py-3 px-4 rounded-md hover:bg-light-cyan transition mt-4">
                    Proceed to Add
                  </button>
                </div>
              )}
            </>
          )}
          
          {view === 'loading' && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-cyan mx-auto"></div>
              <p className="mt-4 text-slate-500 dark:text-slate-400">Analyzing your meal with AI...</p>
            </div>
          )}

          {view === 'confirm' && analyzedFood && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-100 dark:bg-slate-900/70 p-4 rounded-md">
                <h3 className="font-bold text-lg text-slate-800 dark:text-off-white">{analyzedFood.name}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-center">
                  <div><span className="font-bold text-dark-cyan">{Math.round(analyzedFood.calories)}</span><p className="text-sm text-slate-500 dark:text-slate-400">kcal</p></div>
                  <div><span className="font-bold text-slate-800 dark:text-off-white">{Math.round(analyzedFood.protein)}g</span><p className="text-sm text-slate-500 dark:text-slate-400">Protein</p></div>
                  <div><span className="font-bold text-slate-800 dark:text-off-white">{Math.round(analyzedFood.carbohydrates)}g</span><p className="text-sm text-slate-500 dark:text-slate-400">Carbs</p></div>
                  <div><span className="font-bold text-slate-800 dark:text-off-white">{Math.round(analyzedFood.fat)}g</span><p className="text-sm text-slate-500 dark:text-slate-400">Fat</p></div>
                </div>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Add to:</label>
                <select id="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value as MealCategory)} className="w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded-md p-3 focus:ring-dark-cyan focus:border-dark-cyan text-slate-800 dark:text-off-white">
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                  <option>Snacks</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button onClick={() => { setView('start'); setAnalyzedFood(null); }} className="w-full bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-off-white font-bold py-3 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition">
                  Go Back
                </button>
                <button onClick={handleConfirmAdd} className="w-full bg-dark-cyan text-white font-bold py-3 px-4 rounded-md hover:bg-light-cyan transition">
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
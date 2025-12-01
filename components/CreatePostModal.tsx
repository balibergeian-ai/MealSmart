import React, { useState } from 'react';
import { DailyTotals } from '../types';
import { XIcon } from './icons/XIcon';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (message: string) => void;
    dailyTotals: DailyTotals;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit, dailyTotals }) => {
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(message);
        setMessage('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="p-6 relative space-y-4">
                    <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-off-white">Share Your Progress</h2>
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                        <XIcon className="w-6 h-6" />
                    </button>

                    <div>
                        <label htmlFor="post-message" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Add a message (optional)</label>
                        <textarea
                            id="post-message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="How was your day?"
                            className="w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded-md p-3 focus:ring-dark-cyan focus:border-dark-cyan transition text-slate-800 dark:text-off-white placeholder-slate-400 dark:placeholder-slate-500"
                            rows={4}
                        />
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-900/70 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-slate-800 dark:text-off-white mb-2">You'll be sharing this summary:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                            <div><span className="font-bold text-dark-cyan">{Math.round(dailyTotals.calories)}</span><p className="text-xs text-slate-500 dark:text-slate-400">kcal</p></div>
                            <div><span className="font-bold text-slate-800 dark:text-off-white">{Math.round(dailyTotals.protein)}g</span><p className="text-xs text-slate-500 dark:text-slate-400">Protein</p></div>
                            <div><span className="font-bold text-slate-800 dark:text-off-white">{Math.round(dailyTotals.carbs)}g</span><p className="text-xs text-slate-500 dark:text-slate-400">Carbs</p></div>
                            <div><span className="font-bold text-slate-800 dark:text-off-white">{Math.round(dailyTotals.fat)}g</span><p className="text-xs text-slate-500 dark:text-slate-400">Fat</p></div>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-dark-cyan text-white font-bold py-3 px-4 rounded-md hover:bg-light-cyan transition"
                    >
                        Post to Feed
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;
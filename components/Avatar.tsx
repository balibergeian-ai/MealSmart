import React from 'react';
import { SocialUser } from '../types';
import { UserIcon } from './icons/UserIcon';

interface AvatarProps {
  user: { name: string; id: string; avatarUrl?: string; };
  size?: 'sm' | 'md' | 'lg';
}

const getInitials = (name: string) => {
  if (!name) return '?';
  const names = name.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const avatarColors = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500', 
  'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500',
  'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
  'bg-pink-500', 'bg-rose-500'
];

// A simple hash function to get a consistent color for a user ID
const getColorForId = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % avatarColors.length);
  return avatarColors[index];
};


const Avatar: React.FC<AvatarProps> = ({ user, size = 'md' }) => {
  const sizeClasses = 
    size === 'lg' ? 'w-24 h-24 text-2xl' :
    size === 'md' ? 'w-10 h-10 text-base' :
    'w-8 h-8 text-xs';

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className={`${sizeClasses} rounded-full object-cover flex-shrink-0 bg-slate-200 dark:bg-slate-700`}
      />
    );
  }
  
  const color = getColorForId(user.id);

  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${color}`}
      title={user.name}
    >
      {getInitials(user.name)}
    </div>
  );
};

export default Avatar;
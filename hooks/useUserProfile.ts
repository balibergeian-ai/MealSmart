
import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';

const defaultProfile: UserProfile = {
  name: '',
  age: '',
  weight: '', 
  height: '',
  gender: 'female',
  goals: {
    calories: 2000,
    protein: 100,
    carbs: 250,
    fat: 65,
  },
  avatarUrl: undefined,
};

const USER_PROFILE_KEY = 'userProfile';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [isProfileSetup, setIsProfileSetup] = useState(false);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(USER_PROFILE_KEY);
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setUserProfile(parsedProfile);
        // If the name is missing, we assume setup was not completed
        if (!parsedProfile.name) {
            setIsProfileSetup(true);
        }
      } else {
        setIsProfileSetup(true);
      }
    } catch (error) {
      console.error("Failed to load user profile from localStorage", error);
      setIsProfileSetup(true);
    }
  }, []);

  const updateUserProfile = useCallback((newProfile: UserProfile) => {
    try {
      setUserProfile(newProfile);
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProfile));
    } catch (error) {
      console.error("Failed to save user profile to localStorage", error);
    }
  }, []);

  const completeProfileSetup = useCallback((newProfile: UserProfile) => {
    updateUserProfile(newProfile);
    setIsProfileSetup(false);
  }, [updateUserProfile]);

  return { userProfile, updateUserProfile, isProfileSetup, completeProfileSetup };
};
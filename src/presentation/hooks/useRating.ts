/**
 * useRating Hook
 *
 * Hook for simple rating state management.
 */

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RatingValue } from '../../domain/entities/Rating';
import { RATING_STORAGE_KEYS } from '../../domain/entities/RatingConstants';

export interface UseRatingReturn {
  rating: RatingValue;
  setRating: (value: RatingValue) => void;
  save: () => Promise<void>;
  clear: () => Promise<void>;
  loading: boolean;
}

export function useRating(targetType: string, targetId: string, userId: string): UseRatingReturn {
  const [rating, setRatingState] = useState<RatingValue>(0);
  const [loading, setLoading] = useState(false);

  const storageKey = `${RATING_STORAGE_KEYS.REVIEWS}:${targetType}:${targetId}:${userId}`;

  useEffect(() => {
    loadRating();
  }, [targetType, targetId, userId]);

  const loadRating = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        setRatingState(parseFloat(stored) as RatingValue);
      }
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false);
    }
  };

  const setRating = (value: RatingValue) => {
    setRatingState(value);
  };

  const save = async () => {
    try {
      await AsyncStorage.setItem(storageKey, rating.toString());
    } catch (error) {
      // Silent error handling
    }
  };

  const clear = async () => {
    try {
      await AsyncStorage.removeItem(storageKey);
      setRatingState(0);
    } catch (error) {
      // Silent error handling
    }
  };

  return { rating, setRating, save, clear, loading };
}


/**
 * Rating Zustand Store
 *
 * Global state management for ratings and reviews.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Review, ReviewFormData } from '../../domain/entities/Review';
import { RatingStats } from '../../domain/entities/Rating';
import { calculateStats, generateReviewId } from '../../domain/entities/RatingUtils';
import { RATING_STORAGE_KEYS } from '../../domain/entities/RatingConstants';

interface RatingStore {
  reviews: Record<string, Review[]>;
  stats: Record<string, RatingStats>;
  loading: boolean;

  loadReviews: (targetType: string, targetId: string) => Promise<void>;
  addReview: (targetType: string, targetId: string, data: ReviewFormData, userId: string) => Promise<void>;
  updateReview: (reviewId: string, data: Partial<ReviewFormData>) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  markHelpful: (reviewId: string) => Promise<void>;
  getReviews: (targetType: string, targetId: string) => Review[];
  getStats: (targetType: string, targetId: string) => RatingStats | null;
}

export const useRatingStore = create<RatingStore>((set, get) => ({
  reviews: {},
  stats: {},
  loading: false,

  loadReviews: async (targetType: string, targetId: string) => {
    const key = `${targetType}:${targetId}`;
    try {
      set({ loading: true });
      const stored = await AsyncStorage.getItem(`${RATING_STORAGE_KEYS.REVIEWS}:${key}`);
      if (stored) {
        const reviews = JSON.parse(stored) as Review[];
        const stats = calculateStats(reviews);
        set((state) => ({
          reviews: { ...state.reviews, [key]: reviews },
          stats: { ...state.stats, [key]: stats },
        }));
      }
    } catch (error) {
      // Silent error handling
    } finally {
      set({ loading: false });
    }
  },

  addReview: async (targetType: string, targetId: string, data: ReviewFormData, userId: string) => {
    const key = `${targetType}:${targetId}`;
    const review: Review = {
      id: generateReviewId(),
      targetId,
      targetType,
      userId,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      photos: data.photos,
      helpful: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set((state) => {
      const existing = state.reviews[key] || [];
      const updated = [...existing, review];
      const stats = calculateStats(updated);

      AsyncStorage.setItem(`${RATING_STORAGE_KEYS.REVIEWS}:${key}`, JSON.stringify(updated));

      return {
        reviews: { ...state.reviews, [key]: updated },
        stats: { ...state.stats, [key]: stats },
      };
    });
  },

  updateReview: async (reviewId: string, data: Partial<ReviewFormData>) => {
    set((state) => {
      const newReviews = { ...state.reviews };
      let updated = false;

      Object.keys(newReviews).forEach((key) => {
        const reviews = newReviews[key];
        const index = reviews.findIndex((r) => r.id === reviewId);
        if (index !== -1) {
          reviews[index] = {
            ...reviews[index],
            ...data,
            updatedAt: Date.now(),
          };
          updated = true;
          AsyncStorage.setItem(`${RATING_STORAGE_KEYS.REVIEWS}:${key}`, JSON.stringify(reviews));
        }
      });

      return updated ? { reviews: newReviews } : state;
    });
  },

  deleteReview: async (reviewId: string) => {
    set((state) => {
      const newReviews = { ...state.reviews };
      let updated = false;

      Object.keys(newReviews).forEach((key) => {
        const reviews = newReviews[key];
        const filtered = reviews.filter((r) => r.id !== reviewId);
        if (filtered.length !== reviews.length) {
          newReviews[key] = filtered;
          updated = true;
          AsyncStorage.setItem(`${RATING_STORAGE_KEYS.REVIEWS}:${key}`, JSON.stringify(filtered));
        }
      });

      return updated ? { reviews: newReviews } : state;
    });
  },

  markHelpful: async (reviewId: string) => {
    set((state) => {
      const newReviews = { ...state.reviews };
      let updated = false;

      Object.keys(newReviews).forEach((key) => {
        const reviews = newReviews[key];
        const index = reviews.findIndex((r) => r.id === reviewId);
        if (index !== -1) {
          reviews[index].helpful = (reviews[index].helpful || 0) + 1;
          updated = true;
          AsyncStorage.setItem(`${RATING_STORAGE_KEYS.REVIEWS}:${key}`, JSON.stringify(reviews));
        }
      });

      return updated ? { reviews: newReviews } : state;
    });
  },

  getReviews: (targetType: string, targetId: string) => {
    const key = `${targetType}:${targetId}`;
    return get().reviews[key] || [];
  },

  getStats: (targetType: string, targetId: string) => {
    const key = `${targetType}:${targetId}`;
    return get().stats[key] || null;
  },
}));


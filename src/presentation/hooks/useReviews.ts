/**
 * useReviews Hook
 *
 * Hook for full review CRUD operations.
 */

import { useEffect } from 'react';
import { useRatingStore } from '../../infrastructure/storage/RatingStore';
import { Review, ReviewFormData } from '../../domain/entities/Review';
import { RatingStats } from '../../domain/entities/Rating';
import { sortReviews } from '../../domain/entities/RatingUtils';

export interface UseReviewsReturn {
  reviews: Review[];
  stats: RatingStats | null;
  loading: boolean;
  submitReview: (data: ReviewFormData, userId: string) => Promise<void>;
  updateReview: (reviewId: string, data: Partial<ReviewFormData>) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  markHelpful: (reviewId: string) => Promise<void>;
  sortBy: (by: 'recent' | 'helpful' | 'rating') => Review[];
  refresh: () => Promise<void>;
}

export function useReviews(targetType: string, targetId: string): UseReviewsReturn {
  const store = useRatingStore();
  const reviews = store.getReviews(targetType, targetId);
  const stats = store.getStats(targetType, targetId);

  useEffect(() => {
    store.loadReviews(targetType, targetId);
  }, [targetType, targetId]);

  const submitReview = async (data: ReviewFormData, userId: string) => {
    await store.addReview(targetType, targetId, data, userId);
  };

  const updateReview = async (reviewId: string, data: Partial<ReviewFormData>) => {
    await store.updateReview(reviewId, data);
  };

  const deleteReview = async (reviewId: string) => {
    await store.deleteReview(reviewId);
  };

  const markHelpful = async (reviewId: string) => {
    await store.markHelpful(reviewId);
  };

  const sortBy = (by: 'recent' | 'helpful' | 'rating') => {
    return sortReviews(reviews, by);
  };

  const refresh = async () => {
    await store.loadReviews(targetType, targetId);
  };

  return {
    reviews,
    stats,
    loading: store.loading,
    submitReview,
    updateReview,
    deleteReview,
    markHelpful,
    sortBy,
    refresh,
  };
}


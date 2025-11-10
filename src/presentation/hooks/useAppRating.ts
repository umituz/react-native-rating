/**
 * useAppRating Hook
 *
 * Manages app rating flow after challenges/shares
 */

import { useState, useEffect, useCallback } from "react";
import { useRatingStore } from "../../infrastructure/storage/RatingStore";
import type { RatingOptions } from "../../domain/entities/RatingOptions";

export interface UseAppRatingReturn {
  /**
   * Whether rating modal should be shown
   */
  shouldShowRating: boolean;

  /**
   * Show rating modal
   */
  showRating: () => void;

  /**
   * Hide rating modal
   */
  hideRating: () => void;

  /**
   * Track action (challenge/share) - increments counter
   */
  trackAction: () => Promise<void>;

  /**
   * Whether modal is visible
   */
  isVisible: boolean;
}

/**
 * Hook for managing app rating flow
 *
 * @param options - Rating options
 * @returns Rating state and handlers
 */
export const useAppRating = (options: RatingOptions = {}): UseAppRatingReturn => {
  const ratingStore = useRatingStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    ratingStore.initialize(options.storageKey);
  }, [options.storageKey]);

  const shouldShowRating = ratingStore.shouldShowRating({
    actionsBeforeRating: options.actionsBeforeRating,
    daysBetweenRatings: options.daysBetweenRatings,
  });

  const trackAction = useCallback(async () => {
    await ratingStore.incrementActionCount(options.storageKey);

    // Check if we should show rating after incrementing
    const shouldShow = ratingStore.shouldShowRating({
      actionsBeforeRating: options.actionsBeforeRating,
      daysBetweenRatings: options.daysBetweenRatings,
    });

    if (shouldShow) {
      setIsVisible(true);
    }
  }, [options.storageKey, options.actionsBeforeRating, options.daysBetweenRatings]);

  const showRating = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hideRating = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    shouldShowRating,
    showRating,
    hideRating,
    trackAction,
    isVisible,
  };
};


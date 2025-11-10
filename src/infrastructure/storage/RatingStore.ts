/**
 * Rating Store
 *
 * Zustand store for managing app rating state
 * Uses @umituz/react-native-storage for persistence
 */

import { create } from "zustand";
import {
  storageRepository,
  StorageKey,
  unwrap,
} from "@umituz/react-native-storage";
import type { RatingValue } from "../domain/entities/RatingOptions";

interface RatingState {
  hasRated: boolean;
  lastRatingDate: number | null;
  ratingValue: RatingValue | null;
  actionCount: number;
  dismissed: boolean;
  lastDismissedDate: number | null;
}

interface RatingStore {
  // State
  state: RatingState;
  loading: boolean;

  // Actions
  initialize: (storageKey?: string) => Promise<void>;
  incrementActionCount: (storageKey?: string) => Promise<void>;
  setRating: (rating: RatingValue, storageKey?: string) => Promise<void>;
  setDismissed: (storageKey?: string) => Promise<void>;
  shouldShowRating: (options: {
    actionsBeforeRating?: number;
    daysBetweenRatings?: number;
  }) => boolean;
  reset: (storageKey?: string) => Promise<void>;
}

const DEFAULT_STORAGE_KEY = StorageKey.ONBOARDING_COMPLETED; // Reuse for now, can be customized

const getDefaultState = (): RatingState => ({
  hasRated: false,
  lastRatingDate: null,
  ratingValue: null,
  actionCount: 0,
  dismissed: false,
  lastDismissedDate: null,
});

export const useRatingStore = create<RatingStore>((set, get) => ({
  state: getDefaultState(),
  loading: true,

  initialize: async (storageKey = DEFAULT_STORAGE_KEY) => {
    set({ loading: true });

    const result = await storageRepository.getString(
      `${storageKey}_rating`,
      JSON.stringify(getDefaultState()),
    );
    const data = unwrap(result, JSON.stringify(getDefaultState()));

    try {
      const state = JSON.parse(data) as RatingState;
      set({ state, loading: false });
    } catch {
      set({ state: getDefaultState(), loading: false });
    }
  },

  incrementActionCount: async (storageKey = DEFAULT_STORAGE_KEY) => {
    const currentState = get().state;
    const newState: RatingState = {
      ...currentState,
      actionCount: currentState.actionCount + 1,
    };

    await storageRepository.setString(
      `${storageKey}_rating`,
      JSON.stringify(newState),
    );

    set({ state: newState });
  },

  setRating: async (rating: RatingValue, storageKey = DEFAULT_STORAGE_KEY) => {
    const newState: RatingState = {
      ...get().state,
      hasRated: true,
      lastRatingDate: Date.now(),
      ratingValue: rating,
    };

    await storageRepository.setString(
      `${storageKey}_rating`,
      JSON.stringify(newState),
    );

    set({ state: newState });
  },

  setDismissed: async (storageKey = DEFAULT_STORAGE_KEY) => {
    const newState: RatingState = {
      ...get().state,
      dismissed: true,
      lastDismissedDate: Date.now(),
    };

    await storageRepository.setString(
      `${storageKey}_rating`,
      JSON.stringify(newState),
    );

    set({ state: newState });
  },

  shouldShowRating: (options) => {
    const state = get().state;
    const {
      actionsBeforeRating = 3,
      daysBetweenRatings = 90,
    } = options;

    // Don't show if already rated and within cooldown period
    if (state.hasRated && state.lastRatingDate) {
      const daysSinceRating =
        (Date.now() - state.lastRatingDate) / (1000 * 60 * 60 * 24);
      if (daysSinceRating < daysBetweenRatings) {
        return false;
      }
    }

    // Don't show if dismissed recently (within 7 days)
    if (state.dismissed && state.lastDismissedDate) {
      const daysSinceDismissed =
        (Date.now() - state.lastDismissedDate) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return false;
      }
    }

    // Show if action count reached threshold
    return state.actionCount >= actionsBeforeRating;
  },

  reset: async (storageKey = DEFAULT_STORAGE_KEY) => {
    const defaultState = getDefaultState();
    await storageRepository.setString(
      `${storageKey}_rating`,
      JSON.stringify(defaultState),
    );
    set({ state: defaultState });
  },
}));


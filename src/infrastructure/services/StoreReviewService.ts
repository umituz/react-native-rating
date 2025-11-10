/**
 * Store Review Service
 *
 * Handles native store review requests
 */

import * as StoreReview from "expo-store-review";

/**
 * Request store review
 * Opens native store review dialog (iOS/Android)
 */
export const requestStoreReview = async (): Promise<boolean> => {
  try {
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
      return true;
    }
    return false;
  } catch (error) {
    // Silent fail - store review is optional
    return false;
  }
};

/**
 * Check if store review is available
 */
export const isStoreReviewAvailable = async (): Promise<boolean> => {
  try {
    return await StoreReview.isAvailableAsync();
  } catch {
    return false;
  }
};


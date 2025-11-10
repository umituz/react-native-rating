# @umituz/react-native-rating

Generic app rating system for React Native apps. Shows rating modal after challenges/shares and redirects to store review. Follows SOLID, DRY, KISS principles - fully reusable across hundreds of apps.

## Features

- ✅ **Generic & Reusable**: Works with any app, fully customizable via props
- ✅ **Smart Timing**: Shows rating after N actions (challenges/shares)
- ✅ **Store Review Integration**: Redirects to App Store/Play Store
- ✅ **Feedback Collection**: Collects feedback for low ratings
- ✅ **Rate Limiting**: Prevents showing rating too frequently
- ✅ **SOLID Principles**: Clean architecture, easy to extend
- ✅ **DRY**: No code duplication, generic components
- ✅ **KISS**: Simple API, easy to understand and use
- ✅ **Type-Safe**: Full TypeScript support

## Installation

```bash
npm install @umituz/react-native-rating
```

## Usage

### Basic Example

```typescript
import { useAppRating, RatingModal } from '@umituz/react-native-rating';

function MyComponent() {
  const { trackAction, isVisible, hideRating } = useAppRating({
    actionsBeforeRating: 3, // Show after 3 challenges/shares
    minimumRatingForStoreReview: 4, // Show store review for 4+ stars
  });

  const handleShare = async () => {
    // ... share logic ...
    
    // Track action - will show rating modal if threshold reached
    await trackAction();
  };

  return (
    <>
      <Button onPress={handleShare}>Share</Button>
      
      <RatingModal
        visible={isVisible}
        onClose={hideRating}
        onRate={(rating) => {
          console.log('User rated:', rating);
        }}
        onStoreReviewRequested={() => {
          console.log('Store review requested');
        }}
      />
    </>
  );
}
```

### Advanced Example

```typescript
const { trackAction, isVisible, hideRating } = useAppRating({
  actionsBeforeRating: 5,
  daysBetweenRatings: 90,
  minimumRatingForStoreReview: 4,
  title: "Love the app?",
  description: "Rate us on the App Store!",
  feedbackTitle: "Help us improve",
  feedbackDescription: "What can we do better?",
  onRate: async (rating) => {
    // Track rating in analytics
    await analytics.logEvent('app_rated', { rating });
  },
  onStoreReviewRequested: async () => {
    // Track store review request
    await analytics.logEvent('store_review_requested');
  },
  onFeedbackSubmitted: async (rating, feedback) => {
    // Send feedback to backend
    await api.submitFeedback({ rating, feedback });
  },
});
```

## API Reference

### `useAppRating`

Hook for managing app rating flow.

```typescript
const {
  shouldShowRating, // Whether rating should be shown
  showRating,       // Manually show rating modal
  hideRating,       // Hide rating modal
  trackAction,      // Track action (challenge/share)
  isVisible,        // Whether modal is visible
} = useAppRating(options);
```

### `RatingModal`

Rating modal component.

```typescript
<RatingModal
  visible={boolean}
  onClose={() => void}
  minimumRatingForStoreReview?: RatingValue // Default: 4
  title?: string
  description?: string
  feedbackTitle?: string
  feedbackDescription?: string
  onRate?: (rating: RatingValue) => void
  onDismiss?: () => void
  onStoreReviewRequested?: () => void
  onFeedbackSubmitted?: (rating: RatingValue, feedback?: string) => void
/>
```

### `RatingOptions`

```typescript
interface RatingOptions {
  minimumRatingForStoreReview?: RatingValue; // Default: 4
  storageKey?: string;
  actionsBeforeRating?: number; // Default: 3
  daysBetweenRatings?: number; // Default: 90
  title?: string;
  description?: string;
  feedbackTitle?: string;
  feedbackDescription?: string;
  onRate?: (rating: RatingValue) => void;
  onDismiss?: () => void;
  onStoreReviewRequested?: () => void;
  onFeedbackSubmitted?: (rating: RatingValue, feedback?: string) => void;
}
```

## Architecture

- **Domain Layer**: Entities and interfaces (business logic)
- **Infrastructure Layer**: Storage and services (state management, store review)
- **Presentation Layer**: Components and hooks (UI)

No app-specific code, fully generic and reusable.

## License

MIT


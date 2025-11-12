# @umituz/react-native-rating

Comprehensive rating and review system for React Native apps - Star ratings, user reviews, and statistics.

## Features

- ✅ **Interactive Star Rating** - Tap or swipe to rate (1-5 stars)
- ✅ **Half-Star Support** - Optional 0.5 step ratings
- ✅ **Read-Only Display** - Star display for showing ratings
- ✅ **User Reviews** - Rating + title + comment + photos
- ✅ **Review CRUD** - Create, update, delete reviews
- ✅ **Helpful Votes** - Mark reviews as helpful
- ✅ **Rating Statistics** - Average, count, distribution
- ✅ **Offline-First** - AsyncStorage persistence
- ✅ **Haptic Feedback** - Tactile response on selection
- ✅ **Theme-Aware** - Light/dark mode support
- ✅ **Accessible** - VoiceOver/TalkBack ready

## Installation

```bash
npm install @umituz/react-native-rating
```

## Peer Dependencies

```bash
npm install @react-native-async-storage/async-storage @umituz/react-native-design-system @umituz/react-native-design-system-theme expo-haptics
```

## Usage

### Simple Rating

```tsx
import { StarRating, useRating } from '@umituz/react-native-rating';

function ProductRating({ productId }: { productId: string }) {
  const { rating, setRating, save } = useRating('product', productId, userId);

  return (
    <StarRating
      value={rating}
      onChange={async (value) => {
        setRating(value);
        await save();
      }}
    />
  );
}
```

### Display Only

```tsx
import { StarDisplay } from '@umituz/react-native-rating';

<StarDisplay value={4.5} showValue />
// Shows: ⭐⭐⭐⭐✨ 4.5
```

### Full Review System

```tsx
import { useReviews, ReviewCard } from '@umituz/react-native-rating';

function ProductReviews({ productId }: { productId: string }) {
  const { reviews, stats, submitReview } = useReviews('product', productId);

  return (
    <View>
      <StarDisplay value={stats?.average || 0} showValue />
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </View>
  );
}
```

## API Reference

### Components

- `StarRating` - Interactive star rating component
- `StarDisplay` - Read-only star display
- `ReviewCard` - Review card with actions

### Hooks

- `useRating` - Simple rating state management
- `useReviews` - Full review CRUD operations

### Utilities

- `calculateStats` - Calculate rating statistics
- `formatRatingText` - Format rating as text
- `sortReviews` - Sort reviews by criteria

## License

MIT

## Author

Ümit UZ <umit@umituz.com>


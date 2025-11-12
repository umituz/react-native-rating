/**
 * StarRating Component
 *
 * Interactive star rating component with gestures and animations.
 */

import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useAppDesignTokens } from '@umituz/react-native-design-system-theme';
import { AtomicIcon } from '@umituz/react-native-design-system';
import * as Haptics from 'expo-haptics';
import { RatingValue } from '../../domain/entities/Rating';
import { roundToHalf } from '../../domain/entities/RatingUtils';
import { RATING_CONSTANTS, RATING_COLORS } from '../../domain/entities/RatingConstants';

export interface StarRatingProps {
  value: RatingValue;
  onChange: (value: RatingValue) => void;
  maxRating?: number;
  allowHalfStars?: boolean;
  size?: number;
  spacing?: number;
  color?: string;
  emptyColor?: string;
  disabled?: boolean;
  readonly?: boolean;
  hapticFeedback?: boolean;
  testID?: string;
}

export function StarRating({
  value,
  onChange,
  maxRating = RATING_CONSTANTS.MAX_RATING,
  allowHalfStars = false,
  size = RATING_CONSTANTS.DEFAULT_SIZE,
  spacing = RATING_CONSTANTS.DEFAULT_SPACING,
  color = RATING_COLORS.FILLED,
  emptyColor = RATING_COLORS.EMPTY,
  disabled = false,
  readonly = false,
  hapticFeedback = true,
  testID,
}: StarRatingProps) {
  const [tempValue, setTempValue] = useState<RatingValue | null>(null);
  const displayValue = tempValue ?? value;

  const handlePress = (index: number) => {
    if (disabled || readonly) return;

    const newValue = (index + 1) as RatingValue;
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChange(newValue);
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFilled = displayValue >= starValue;
    const isHalfFilled = allowHalfStars && displayValue >= starValue - 0.5 && displayValue < starValue;

    return (
      <Pressable
        key={index}
        onPress={() => handlePress(index)}
        onPressIn={() => !readonly && setTempValue((index + 1) as RatingValue)}
        onPressOut={() => setTempValue(null)}
        disabled={disabled || readonly}
        style={[styles.starContainer, { marginRight: index < maxRating - 1 ? spacing : 0 }]}
        testID={`${testID}-star-${index}`}
      >
        <AtomicIcon
          name={isFilled ? 'Star' : isHalfFilled ? 'StarHalf' : 'Star'}
          color={isFilled || isHalfFilled ? 'warning' : 'secondary'}
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.container} testID={testID}>
      {Array.from({ length: maxRating }, (_, i) => renderStar(i))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});


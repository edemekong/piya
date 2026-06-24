export const appSpacing = {
  webWidth: 1080,
  screenPadding: 28,
  cardPadding: 22.4,
  elementSpacing: 11.2,
  elementSpacingSmall: 5.6,
  radius: 5,
  outlineWidth: 0.5,
  cardOutlineWidth: 0.5,
  radiusDefault: 12.5,
  radiusTextField: 7.5,
  radiusLarge: 15,
  radiusPill: 999,
} as const;

export type AppSpacingToken = keyof typeof appSpacing;

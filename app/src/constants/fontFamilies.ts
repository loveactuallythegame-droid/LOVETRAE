export const FONT_FAMILIES = {
  BarbieDream: 'BarbieDream-Regular',
  Cheese: 'Cheese-Regular',
  HolidayChristmas: 'HolidayChristmas-Regular',
  SweetPink: 'SweetPink-Regular',
  WonderfulSometimes: 'WonderfulSometimes-Regular',
  Cute: 'Cute-Regular',
  Nietha: 'Nietha-Regular',
  Pink: 'Pink-Regular',
  Smile: 'Smile-Regular',
} as const;

export type FontFamilyKey = keyof typeof FONT_FAMILIES;

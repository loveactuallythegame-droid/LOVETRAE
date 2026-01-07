import { ReactNode } from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { FONT_FAMILIES } from '../../constants/fontFamilies';
import { scaleFont } from '../../lib/typography';
import { useAppStore } from '../../state/store';
import { COLORS } from '../../constants/colors';

type Variant = 'header' | 'body' | 'instructions' | 'sass' | 'keyword';

type TextProps = RNTextProps & {
  variant?: Variant;
  children: ReactNode;
};

export default function Text({ variant = 'body', style, children, ...rest }: TextProps) {
  const { family, size } = mapVariant(variant);
  const fontScale = useAppStore((s) => s.fontScale);
  const highContrast = useAppStore((s) => s.highContrast);
  const theme = useAppStore((s) => s.theme);
  const color = theme === 'light' ? COLORS.textDark : COLORS.textLight;
  const shadow = highContrast ? { textShadowColor: '#000000', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 } : {};
  return (
    <RNText {...rest} accessibilityRole={rest.accessibilityRole} style={[{ fontFamily: family, fontSize: scaleFont(size * fontScale), color }, shadow, style]}>
      {children}
    </RNText>
  );
}

function mapVariant(variant: Variant) {
  if (variant === 'header') return { family: FONT_FAMILIES.BarbieDream, size: 28 };
  if (variant === 'instructions') return { family: FONT_FAMILIES.HolidayChristmas, size: 18 };
  if (variant === 'sass') return { family: FONT_FAMILIES.SweetPink, size: 16 };
  if (variant === 'keyword') return { family: FONT_FAMILIES.WonderfulSometimes, size: 16 };
  return { family: FONT_FAMILIES.Cheese, size: 16 };
}

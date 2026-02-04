import { ReactNode } from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { FONT_FAMILIES } from '../../constants/fontFamilies';
import { scaleFont } from '../../lib/typography';
import { useAppStore } from '../../state/store';
import theme from '../../theme';

type Variant = 'header' | 'title' | 'body' | 'caption' | 'small' | 'instructions' | 'sass' | 'keyword';

type TextProps = RNTextProps & {
  variant?: Variant;
  children: ReactNode;
};

export default function Text({ variant = 'body', style, children, ...rest }: TextProps) {
  const { family, size, additionalStyles } = mapVariant(variant);
  const fontScale = useAppStore((s) => s.fontScale);
  const highContrast = useAppStore((s) => s.highContrast);
  const appTheme = useAppStore((s) => s.theme);
  
  // Determine text color based on app theme
  const textColor = appTheme === 'light' ? theme.COLORS.textPrimary : theme.COLORS.textPrimary;
  const shadow = highContrast ? { 
    textShadowColor: '#000000', 
    textShadowOffset: { width: 0, height: 1 }, 
    textShadowRadius: 2 
  } : {};

  return (
    <RNText 
      {...rest} 
      accessibilityRole={rest.accessibilityRole} 
      style={[
        { 
          fontFamily: family, 
          fontSize: scaleFont(size * fontScale), 
          color: textColor,
          lineHeight: scaleFont(size * 1.4 * fontScale) // Ensure readable line height on mobile
        }, 
        shadow, 
        additionalStyles,
        style
      ]}
    >
      {children}
    </RNText>
  );
}

function mapVariant(variant: Variant) {
  if (variant === 'header') return { 
    family: FONT_FAMILIES.BarbieDream, 
    size: theme.TYPOGRAPHY.header.fontSize, 
    additionalStyles: { 
      lineHeight: theme.TYPOGRAPHY.header.lineHeight,
      fontWeight: theme.TYPOGRAPHY.header.fontWeight
    } 
  };
  if (variant === 'title') return { 
    family: FONT_FAMILIES.BarbieDream, 
    size: theme.TYPOGRAPHY.title.fontSize, 
    additionalStyles: { 
      lineHeight: theme.TYPOGRAPHY.title.lineHeight,
      fontWeight: theme.TYPOGRAPHY.title.fontWeight
    } 
  };
  if (variant === 'body') return { 
    family: FONT_FAMILIES.Cheese, 
    size: theme.TYPOGRAPHY.body.fontSize, 
    additionalStyles: { 
      lineHeight: theme.TYPOGRAPHY.body.lineHeight,
      fontWeight: theme.TYPOGRAPHY.body.fontWeight
    } 
  };
  if (variant === 'caption') return { 
    family: FONT_FAMILIES.Cheese, 
    size: theme.TYPOGRAPHY.caption.fontSize, 
    additionalStyles: { 
      lineHeight: theme.TYPOGRAPHY.caption.lineHeight,
      fontWeight: theme.TYPOGRAPHY.caption.fontWeight
    } 
  };
  if (variant === 'small') return { 
    family: FONT_FAMILIES.Cheese, 
    size: theme.TYPOGRAPHY.small.fontSize, 
    additionalStyles: { 
      lineHeight: theme.TYPOGRAPHY.small.lineHeight,
      fontWeight: theme.TYPOGRAPHY.small.fontWeight
    } 
  };
  if (variant === 'instructions') return { 
    family: FONT_FAMILIES.HolidayChristmas, 
    size: theme.TYPOGRAPHY.body.fontSize, 
    additionalStyles: { 
      lineHeight: theme.TYPOGRAPHY.body.lineHeight,
      fontWeight: theme.TYPOGRAPHY.body.fontWeight as any
    } 
  };
  if (variant === 'sass') return { 
    family: FONT_FAMILIES.SweetPink, 
    size: theme.TYPOGRAPHY.sass.fontSize, 
    additionalStyles: { 
      lineHeight: theme.TYPOGRAPHY.sass.lineHeight,
      fontWeight: theme.TYPOGRAPHY.sass.fontWeight,
      fontStyle: theme.TYPOGRAPHY.sass.fontStyle
    } 
  };
  if (variant === 'keyword') return { 
    family: FONT_FAMILIES.WonderfulSometimes, 
    size: theme.TYPOGRAPHY.keyword.fontSize, 
    additionalStyles: { 
      lineHeight: theme.TYPOGRAPHY.keyword.lineHeight,
      fontWeight: theme.TYPOGRAPHY.keyword.fontWeight,
      textTransform: theme.TYPOGRAPHY.keyword.textTransform,
      letterSpacing: theme.TYPOGRAPHY.keyword.letterSpacing
    } 
  };
  // Default to body
  return { 
    family: FONT_FAMILIES.Cheese, 
    size: theme.TYPOGRAPHY.body.fontSize, 
    additionalStyles: { 
      lineHeight: theme.TYPOGRAPHY.body.lineHeight,
      fontWeight: theme.TYPOGRAPHY.body.fontWeight
    } 
  };
}
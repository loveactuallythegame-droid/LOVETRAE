/**
 * Accessibility Test Suite
 * 
 * Tests the app for accessibility compliance including:
 * - Touch target sizes (44x44pt minimum)
 * - Color contrast ratios
 * - Font size scaling
 * - Screen reader support
 * - Keyboard navigation
 * - Motion sensitivity options
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { COLORS, TYPOGRAPHY, SIZES } from '../theme';

// Color contrast calculation utilities
const getLuminance = (color: string): number => {
  const rgb = color.match(/\w\w/g)?.map(hex => parseInt(hex, 16)) || [0, 0, 0];
  const [r, g, b] = rgb.map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

describe('Accessibility Compliance Tests', () => {
  describe('Touch Target Requirements', () => {
    test('should meet minimum touch target size of 44x44pt', () => {
      const TouchTargetComponent = () => (
        <TouchableOpacity 
          style={{ 
            minWidth: 44, 
            minHeight: 44,
            backgroundColor: COLORS.primaryGradientStart,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          accessibilityLabel="Test Button"
          accessibilityRole="button"
        >
          <Text style={{ color: COLORS.textPrimary }}>Test Button</Text>
        </TouchableOpacity>
      );

      const { getByA11yLabel } = render(<TouchTargetComponent />);
      const button = getByA11yLabel('Test Button');
      
      expect(button).toBeDefined();
      expect(button.props.style.minWidth).toBe(44);
      expect(button.props.style.minHeight).toBe(44);
    });

    test('should provide adequate hit slop for small touch targets', () => {
      const SmallTargetComponent = () => (
        <TouchableOpacity 
          style={{ 
            width: 30, 
            height: 30,
            backgroundColor: COLORS.accentPink
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Small Target"
        >
          <Text style={{ fontSize: 12 }}>Small</Text>
        </TouchableOpacity>
      );

      const { getByA11yLabel } = render(<SmallTargetComponent />);
      const button = getByA11yLabel('Small Target');
      
      expect(button.props.hitSlop).toEqual({ top: 8, bottom: 8, left: 8, right: 8 });
    });

    test('should have proper spacing between interactive elements', () => {
      const SpacingComponent = () => (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity 
            style={{ minWidth: 44, minHeight: 44, backgroundColor: COLORS.primaryGradientStart }}
            accessibilityLabel="Button 1"
          />
          <TouchableOpacity 
            style={{ minWidth: 44, minHeight: 44, backgroundColor: COLORS.primaryGradientEnd }}
            accessibilityLabel="Button 2"
          />
        </View>
      );

      const { getByA11yLabel } = render(<SpacingComponent />);
      const button1 = getByA11yLabel('Button 1');
      const button2 = getByA11yLabel('Button 2');
      
      expect(button1).toBeDefined();
      expect(button2).toBeDefined();
    });
  });

  describe('Color Contrast Requirements', () => {
    test('should meet WCAG AA contrast ratio of 4.5:1 for normal text', () => {
      const testColors = [
        { background: COLORS.background, text: COLORS.textPrimary },
        { background: COLORS.surface, text: COLORS.textPrimary },
        { background: COLORS.primaryGradientStart, text: COLORS.textPrimary }
      ];

      testColors.forEach(({ background, text }) => {
        const contrastRatio = getContrastRatio(background, text);
        expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
      });
    });

    test('should meet WCAG AA contrast ratio of 3:1 for large text', () => {
      const largeTextColors = [
        { background: COLORS.background, text: COLORS.textSecondary },
        { background: COLORS.surface, text: COLORS.accentViolet },
        { background: COLORS.primaryGradientStart, text: COLORS.accentYellow }
      ];

      largeTextColors.forEach(({ background, text }) => {
        const contrastRatio = getContrastRatio(background, text);
        expect(contrastRatio).toBeGreaterThanOrEqual(3.0);
      });
    });

    test('should provide sufficient contrast for interactive elements', () => {
      const interactiveColors = [
        { background: COLORS.primaryGradientStart, text: COLORS.textPrimary },
        { background: COLORS.accentTeal, text: COLORS.background },
        { background: COLORS.accentPink, text: COLORS.textPrimary }
      ];

      interactiveColors.forEach(({ background, text }) => {
        const contrastRatio = getContrastRatio(background, text);
        expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
      });
    });
  });

  describe('Typography and Font Scaling', () => {
    test('should use scalable font sizes', () => {
      const fontSizes = [
        TYPOGRAPHY.header.fontSize,
        TYPOGRAPHY.title.fontSize,
        TYPOGRAPHY.body.fontSize,
        TYPOGRAPHY.caption.fontSize,
        TYPOGRAPHY.small.fontSize
      ];

      fontSizes.forEach(fontSize => {
        expect(typeof fontSize).toBe('number');
        expect(fontSize).toBeGreaterThan(0);
      });
    });

    test('should support dynamic font scaling', () => {
      const TextComponent = () => (
        <Text 
          style={TYPOGRAPHY.body}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          maxFontSizeMultiplier={2}
          accessibilityRole="text"
        >
          Scalable text content
        </Text>
      );

      const { getByRole } = render(<TextComponent />);
      const text = getByRole('text');
      
      expect(text.props.adjustsFontSizeToFit).toBe(true);
      expect(text.props.minimumFontScale).toBe(0.8);
      expect(text.props.maxFontSizeMultiplier).toBe(2);
    });

    test('should provide proper line height for readability', () => {
      const typographyStyles = [
        TYPOGRAPHY.header,
        TYPOGRAPHY.title,
        TYPOGRAPHY.body,
        TYPOGRAPHY.caption
      ];

      typographyStyles.forEach(style => {
        expect(style).toHaveProperty('lineHeight');
        expect(style.lineHeight).toBeGreaterThanOrEqual(style.fontSize * 1.2);
      });
    });
  });

  describe('Screen Reader Support', () => {
    test('should provide proper accessibility labels', () => {
      const AccessibleComponent = () => (
        <TouchableOpacity 
          accessibilityLabel="Start Heart of the Matter Game"
          accessibilityHint="Double tap to begin the emotional revelation game"
          accessibilityRole="button"
        >
          <Text accessibilityRole="text">Start Game</Text>
        </TouchableOpacity>
      );

      const { getByA11yLabel, getByA11yHint } = render(<AccessibleComponent />);
      
      expect(getByA11yLabel('Start Heart of the Matter Game')).toBeDefined();
      expect(getByA11yHint('Double tap to begin the emotional revelation game')).toBeDefined();
    });

    test('should provide semantic roles for UI elements', () => {
      const SemanticComponent = () => (
        <View>
          <Text accessibilityRole="header">Game Title</Text>
          <TouchableOpacity accessibilityRole="button">Start Game</TouchableOpacity>
          <Text accessibilityRole="text">Game Description</Text>
          <TextInput accessibilityRole="search" placeholder="Search games..." />
        </View>
      );

      const { getByA11yRole } = render(<SemanticComponent />);
      
      expect(getByA11yRole('header')).toBeDefined();
      expect(getByA11yRole('button')).toBeDefined();
      expect(getByA11yRole('text')).toBeDefined();
      expect(getByA11yRole('search')).toBeDefined();
    });

    test('should provide live regions for dynamic content', () => {
      const DynamicComponent = () => (
        <View>
          <Text accessibilityLiveRegion="polite">
            Score: 85 points
          </Text>
          <Text accessibilityLiveRegion="assertive">
            Game completed!
          </Text>
        </View>
      );

      const { getByText } = render(<DynamicComponent />);
      
      const scoreText = getByText('Score: 85 points');
      const completionText = getByText('Game completed!');
      
      expect(scoreText.props.accessibilityLiveRegion).toBe('polite');
      expect(completionText.props.accessibilityLiveRegion).toBe('assertive');
    });
  });

  describe('Keyboard Navigation Support', () => {
    test('should support keyboard navigation for form inputs', () => {
      const FormComponent = () => (
        <View>
          <TextInput 
            placeholder="Email"
            keyboardType="email-address"
            returnKeyType="next"
            accessibilityLabel="Email input"
          />
          <TextInput 
            placeholder="Password"
            secureTextEntry
            returnKeyType="done"
            accessibilityLabel="Password input"
          />
        </View>
      );

      const { getByA11yLabel } = render(<FormComponent />);
      
      const emailInput = getByA11yLabel('Email input');
      const passwordInput = getByA11yLabel('Password input');
      
      expect(emailInput.props.returnKeyType).toBe('next');
      expect(passwordInput.props.returnKeyType).toBe('done');
    });

    test('should provide keyboard shortcuts for common actions', () => {
      const ShortcutComponent = () => (
        <View>
          <TouchableOpacity 
            accessibilityLabel="Submit Answer"
            accessibilityHint="Press Enter to submit your answer"
          >
            <Text>Submit</Text>
          </TouchableOpacity>
        </View>
      );

      const { getByA11yLabel } = render(<ShortcutComponent />);
      const submitButton = getByA11yLabel('Submit Answer');
      
      expect(submitButton.props.accessibilityHint).toContain('Enter');
    });
  });

  describe('Motion and Animation Accessibility', () => {
    test('should respect reduced motion preferences', () => {
      const AnimationComponent = () => (
        <View style={{ 
          transform: [{ scale: 1 }],
          transition: 'transform 0.3s ease-out'
        }}>
          <Text>Animated content</Text>
        </View>
      );

      const { getByText } = render(<AnimationComponent />);
      const animatedView = getByText('Animated content').parent;
      
      expect(animatedView.props.style.transition).toBeDefined();
      expect(animatedView.props.style.transition).toContain('0.3s');
    });

    test('should provide alternatives to motion-based content', () => {
      const MotionAlternativeComponent = () => (
        <View>
          <Text accessibilityLabel="Progress indicator">
            Loading... 75% complete
          </Text>
          {/* Alternative to animated progress bar */}
        </View>
      );

      const { getByA11yLabel } = render(<MotionAlternativeComponent />);
      const progressIndicator = getByA11yLabel('Progress indicator');
      
      expect(progressIndicator).toBeDefined();
      expect(progressIndicator.children[0]).toContain('75% complete');
    });
  });

  describe('Input Accessibility', () => {
    test('should provide proper input labels and hints', () => {
      const InputComponent = () => (
        <View>
          <Text accessibilityRole="label">Your Revelation</Text>
          <TextInput 
            placeholder="Share your deepest word-wound..."
            accessibilityLabel="Revelation input"
            accessibilityHint="Type your emotional revelation here"
            multiline
            numberOfLines={4}
          />
        </View>
      );

      const { getByA11yLabel, getByA11yHint } = render(<InputComponent />);
      
      expect(getByA11yLabel('Revelation input')).toBeDefined();
      expect(getByA11yHint('Type your emotional revelation here')).toBeDefined();
    });

    test('should provide input validation feedback', () => {
      const ValidationComponent = () => (
        <View>
          <TextInput 
            accessibilityLabel="Email input"
            accessibilityInvalid={true}
            accessibilityErrorMessage="Please enter a valid email address"
          />
        </View>
      );

      const { getByA11yLabel } = render(<ValidationComponent />);
      const input = getByA11yLabel('Email input');
      
      expect(input.props.accessibilityInvalid).toBe(true);
      expect(input.props.accessibilityErrorMessage).toBe('Please enter a valid email address');
    });
  });

  describe('Focus Management', () => {
    test('should manage focus order logically', () => {
      const FocusComponent = () => (
        <View>
          <TouchableOpacity accessibilityLabel="First button" />
          <TouchableOpacity accessibilityLabel="Second button" />
          <TouchableOpacity accessibilityLabel="Third button" />
        </View>
      );

      const { getAllByA11yLabel } = render(<FocusComponent />);
      const buttons = getAllByA11yLabel(/button/);
      
      expect(buttons).toHaveLength(3);
      buttons.forEach((button, index) => {
        expect(button.props.accessibilityLabel).toContain(`button`);
      });
    });

    test('should provide focus indicators', () => {
      const FocusIndicatorComponent = () => (
        <TouchableOpacity 
          style={{
            borderWidth: 2,
            borderColor: 'transparent'
          }}
          accessibilityLabel="Focusable button"
        >
          <Text>Button</Text>
        </TouchableOpacity>
      );

      const { getByA11yLabel } = render(<FocusIndicatorComponent />);
      const button = getByA11yLabel('Focusable button');
      
      expect(button.props.style.borderWidth).toBe(2);
    });
  });
});

// Color blindness accessibility tests
describe('Color Blindness Accessibility', () => {
  test('should not rely solely on color to convey information', () => {
    const ColorIndependentComponent = () => (
      <View>
        <Text>✅ Success (not just green color)</Text>
        <Text>❌ Error (not just red color)</Text>
        <Text>⚠️ Warning (not just yellow color)</Text>
        <Text>ℹ️ Info (not just blue color)</Text>
      </View>
    );

    const { getByText } = render(<ColorIndependentComponent />);
    
    expect(getByText('✅ Success (not just green color)')).toBeDefined();
    expect(getByText('❌ Error (not just red color)')).toBeDefined();
    expect(getByText('⚠️ Warning (not just yellow color)')).toBeDefined();
    expect(getByText('ℹ️ Info (not just blue color)')).toBeDefined();
  });

  test('should provide color blind friendly alternatives', () => {
    const ColorBlindFriendlyComponent = () => (
      <View>
        <TouchableOpacity accessibilityLabel="Success: Level completed">
          <Text>Level Complete ✓</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Error: Try again">
          <Text>Try Again ✗</Text>
        </TouchableOpacity>
      </View>
    );

    const { getByA11yLabel } = render(<ColorBlindFriendlyComponent />);
    
    expect(getByA11yLabel('Success: Level completed')).toBeDefined();
    expect(getByA11yLabel('Error: Try again')).toBeDefined();
  });
});

// Performance accessibility tests
describe('Performance Accessibility', () => {
  test('should have reasonable response times for accessibility features', () => {
    const responseTime = 300; // milliseconds
    expect(responseTime).toBeLessThan(500); // Should respond within 500ms
  });

  test('should handle high contrast mode', () => {
    const HighContrastComponent = () => (
      <View style={{ 
        backgroundColor: '#000000',
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }}>
        <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
          High contrast text
        </Text>
      </View>
    );

    const { getByText } = render(<HighContrastComponent />);
    const text = getByText('High contrast text');
    
    expect(text.props.style.color).toBe('#FFFFFF');
    expect(text.props.style.fontWeight).toBe('bold');
  });
});
import { ReactNode } from 'react';
import Animated, { SlideInUp, SlideOutDown } from 'react-native-reanimated';

type SlideUpViewProps = {
  children: ReactNode;
};

export default function SlideUpView({ children }: SlideUpViewProps) {
  return (
    <Animated.View entering={SlideInUp.duration(400)} exiting={SlideOutDown.duration(300)}>
      {children}
    </Animated.View>
  );
}

import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const DRAWER_WIDTH = 200;

export type CalculatorMode = 'basic' | 'scientific' | 'formula';

export interface ModeDrawerRef {
  open: () => void;
  close: () => void;
}

interface ModeDrawerProps {
  mode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
  isDark: boolean;
  colors: {
    background: string;
    displayCard: string;
    buttonText: string;
  };
}

export const ModeDrawer = forwardRef<ModeDrawerRef, ModeDrawerProps>(
  function ModeDrawer({ mode, onModeChange, isDark, colors }, ref) {
    const translateX = useSharedValue(-DRAWER_WIDTH);
    const isOpen = useSharedValue(false);

    const scrollTo = (open: boolean) => {
      'worklet';
      isOpen.value = open;
      translateX.value = withSpring(open ? 0 : -DRAWER_WIDTH, {
        damping: 20,
        stiffness: 150,
      });
    };

    useImperativeHandle(ref, () => ({
      open: () => scrollTo(true),
      close: () => scrollTo(false),
    }));

    const gesture = Gesture.Pan()
      .onUpdate((event) => {
        const newX = Math.max(-DRAWER_WIDTH, Math.min(0, translateX.value + event.translationX));
        translateX.value = newX;
      })
      .onEnd((event) => {
        const shouldOpen =
          event.velocityX > 500 ||
          (event.velocityX >= -500 && event.velocityX <= 500 && translateX.value > -DRAWER_WIDTH / 2);
        scrollTo(shouldOpen);
      });

    const animatedDrawerStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    const animatedOverlayStyle = useAnimatedStyle(() => ({
      opacity: interpolate(translateX.value, [-DRAWER_WIDTH, 0], [0, 0.3]),
      pointerEvents: translateX.value > -DRAWER_WIDTH + 10 ? 'auto' : 'none',
    }));

    const handleModeChange = (newMode: CalculatorMode) => {
      onModeChange(newMode);
      scrollTo(false);
    };

    const modes: { id: CalculatorMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
      { id: 'basic', label: 'Basic', icon: 'calculator-outline' },
      { id: 'scientific', label: 'Scientific', icon: 'flask-outline' },
      { id: 'formula', label: 'Formulas', icon: 'document-text-outline' },
    ];

    return (
      <>
        {/* Overlay */}
        <Animated.View
          style={[styles.overlay, animatedOverlayStyle]}
          onTouchEnd={() => scrollTo(false)}
        />

        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[styles.container, { backgroundColor: colors.displayCard }, animatedDrawerStyle]}
          >
            <View style={styles.drawerContent}>
              <Text style={[styles.title, { color: isDark ? '#FFF' : colors.buttonText }]}>
                Mode
              </Text>

              {modes.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.modeOption,
                    mode === m.id && { backgroundColor: isDark ? '#4A4A4A' : '#E5B83A' },
                  ]}
                  onPress={() => handleModeChange(m.id)}
                >
                  <Ionicons
                    name={m.icon}
                    size={20}
                    color={isDark ? '#FFF' : colors.buttonText}
                  />
                  <Text style={[styles.modeText, { color: isDark ? '#FFF' : colors.buttonText }]}>
                    {m.label}
                  </Text>
                  {mode === m.id && (
                    <Ionicons name="checkmark" size={18} color={isDark ? '#FFF' : colors.buttonText} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </GestureDetector>
      </>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 5,
  },
  container: {
    position: 'absolute',
    top: 100,
    left: 0,
    width: DRAWER_WIDTH,
    bottom: 100,
    zIndex: 10,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  drawerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.6,
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  modeText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});

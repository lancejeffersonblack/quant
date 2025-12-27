import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface CalculatorButtonProps {
  label: string;
  onPress: () => void;
  backgroundColor: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isDouble?: boolean;
}

export function CalculatorButton({
  label,
  onPress,
  backgroundColor,
  textColor = '#2D2D3A',
  style,
  textStyle,
  isDouble = false,
}: CalculatorButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        isDouble && styles.doubleButton,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, { color: textColor }, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doubleButton: {
    height: 150,
    borderRadius: 35,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '500',
  },
});

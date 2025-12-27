import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  textColor: string;
}

export function ThemeToggle({ isDark, onToggle, textColor }: ThemeToggleProps) {
  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggle();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleContainer} onPress={handleToggle} activeOpacity={0.8}>
        <View style={[styles.toggle, isDark && styles.toggleDark]}>
          <View style={[styles.toggleThumb, isDark && styles.toggleThumbDark]} />
        </View>
        <Text style={[styles.label, { color: textColor }]}>
          {isDark ? 'SWITCH TO LIGHT THEME' : 'SWITCH TO DARK THEME'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.historyButton}>
        <Ionicons name="swap-vertical" size={20} color={textColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1D1D6',
    padding: 2,
    justifyContent: 'center',
  },
  toggleDark: {
    backgroundColor: '#48484A',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbDark: {
    alignSelf: 'flex-end',
  },
  label: {
    marginLeft: 10,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  historyButton: {
    padding: 8,
  },
});

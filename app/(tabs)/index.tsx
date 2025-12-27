import { CalculatorDisplay } from '@/components/calculator/calculator-display';
import { CalculatorKeypad } from '@/components/calculator/calculator-keypad';
import { ScientificDisplay } from '@/components/calculator/scientific-display';
import { ScientificKeypad } from '@/components/calculator/scientific-keypad';
import { Colors } from '@/constants/theme';
import { useCalculator } from '@/hooks/use-calculator';
import { useScientificCalculator } from '@/hooks/use-scientific-calculator';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CalculatorScreen() {
  const [isDark, setIsDark] = useState(true);
  const [isScientific, setIsScientific] = useState(false);
  const colors = isDark ? Colors.dark : Colors.light;

  const basicCalc = useCalculator();
  const scientificCalc = useScientificCalculator();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#FFF' : colors.buttonText }]}>
          Calculator
        </Text>
        <TouchableOpacity onPress={() => setIsDark(!isDark)} style={styles.themeButton}>
          <Ionicons 
            name={isDark ? 'sunny-outline' : 'moon-outline'} 
            size={22} 
            color={isDark ? '#FFF' : colors.buttonText} 
          />
        </TouchableOpacity>
      </View>

      {/* Mode Toggle */}
      <View style={styles.modeToggleContainer}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            !isScientific && styles.modeButtonActive,
            { backgroundColor: !isScientific ? (isDark ? '#4A4A4A' : '#E5B83A') : 'transparent' },
          ]}
          onPress={() => setIsScientific(false)}
        >
          <Text style={[styles.modeButtonText, { color: isDark ? '#FFF' : colors.buttonText }]}>
            Basic
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            isScientific && styles.modeButtonActive,
            { backgroundColor: isScientific ? (isDark ? '#4A4A4A' : '#E5B83A') : 'transparent' },
          ]}
          onPress={() => setIsScientific(true)}
        >
          <Text style={[styles.modeButtonText, { color: isDark ? '#FFF' : colors.buttonText }]}>
            Scientific
          </Text>
        </TouchableOpacity>
      </View>

      {isScientific ? (
        <>
          <ScientificDisplay
            expression={scientificCalc.expression}
            cursor={scientificCalc.cursor}
            result={scientificCalc.result}
            history={scientificCalc.history}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            angleMode={scientificCalc.angleMode}
            cardBackgroundColor={colors.displayCard}
          />

          <ScientificKeypad
            colors={{
              clearButton: colors.clearButton,
              operatorButton: colors.operatorButton,
              functionButton: colors.functionButton,
              numberButton: colors.numberButton,
              equalsButton: colors.equalsButton,
              minusButton: colors.minusButton,
              plusButton: colors.plusButton,
              buttonText: colors.buttonText,
              operatorText: colors.operatorText,
            }}
            angleMode={scientificCalc.angleMode}
            onNumber={scientificCalc.handleNumber}
            onOperator={scientificCalc.handleOperator}
            onClear={scientificCalc.handleClear}
            onBackspace={scientificCalc.handleBackspace}
            onEquals={scientificCalc.handleEquals}
            onFraction={scientificCalc.handleFraction}
            onPower={scientificCalc.handlePower}
            onSquareRoot={scientificCalc.handleSquareRoot}
            onNthRoot={scientificCalc.handleNthRoot}
            onTrig={scientificCalc.handleTrig}
            onLog={scientificCalc.handleLog}
            onParenthesis={scientificCalc.handleParenthesis}
            onAbs={scientificCalc.handleAbs}
            onVariable={scientificCalc.handleVariable}
            onNavigateLeft={scientificCalc.navigateLeft}
            onNavigateRight={scientificCalc.navigateRight}
            onToggleAngleMode={scientificCalc.toggleAngleMode}
          />
        </>
      ) : (
        <>
          <CalculatorDisplay
            result={basicCalc.display}
            history={basicCalc.history}
            currentExpression={basicCalc.currentExpression}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            backgroundColor={colors.background}
            cardBackgroundColor={colors.displayCard}
          />

          <CalculatorKeypad
            colors={{
              clearButton: colors.clearButton,
              operatorButton: colors.operatorButton,
              functionButton: colors.functionButton,
              numberButton: colors.numberButton,
              equalsButton: colors.equalsButton,
              minusButton: colors.minusButton,
              plusButton: colors.plusButton,
              buttonText: colors.buttonText,
              operatorText: colors.operatorText,
            }}
            onNumber={basicCalc.handleNumber}
            onOperator={basicCalc.handleOperator}
            onClear={basicCalc.handleClear}
            onBackspace={basicCalc.handleBackspace}
            onEquals={basicCalc.handleEquals}
            onParenthesis={basicCalc.handleParenthesis}
            onSquareRoot={basicCalc.handleSquareRoot}
            onPercent={basicCalc.handlePercent}
            onPlusMinus={basicCalc.handlePlusMinus}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
  themeButton: {
    padding: 8,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 4,
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modeButtonActive: {},
  modeButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

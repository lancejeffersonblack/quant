import { CalculatorDisplay } from '@/components/calculator/calculator-display';
import { CalculatorKeypad } from '@/components/calculator/calculator-keypad';
import { ThemeToggle } from '@/components/calculator/theme-toggle';
import { Colors } from '@/constants/theme';
import { useCalculator } from '@/hooks/use-calculator';
import React, { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CalculatorScreen() {
  const [isDark, setIsDark] = useState(false);
  const colors = isDark ? Colors.dark : Colors.light;
  
  const {
    display,
    history,
    currentExpression,
    handleNumber,
    handleOperator,
    handleClear,
    handleBackspace,
    handleEquals,
    handleParenthesis,
    handleSquareRoot,
    handlePercent,
    handlePlusMinus,
  } = useCalculator();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <CalculatorDisplay
        result={display}
        history={history}
        currentExpression={currentExpression}
        textColor={colors.text}
        secondaryTextColor={colors.textSecondary}
      />
      
      <ThemeToggle
        isDark={isDark}
        onToggle={() => setIsDark(!isDark)}
        textColor={colors.textSecondary}
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
        onNumber={handleNumber}
        onOperator={handleOperator}
        onClear={handleClear}
        onBackspace={handleBackspace}
        onEquals={handleEquals}
        onParenthesis={handleParenthesis}
        onSquareRoot={handleSquareRoot}
        onPercent={handlePercent}
        onPlusMinus={handlePlusMinus}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

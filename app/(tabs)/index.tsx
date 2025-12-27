import { CalculatorDisplay } from "@/components/calculator/calculator-display";
import { CalculatorKeypad } from "@/components/calculator/calculator-keypad";
import { ScientificDisplay } from "@/components/calculator/scientific-display";
import { ScientificKeypad } from "@/components/calculator/scientific-keypad";
import { ThemeToggle } from "@/components/calculator/theme-toggle";
import { Colors } from "@/constants/theme";
import { useCalculator } from "@/hooks/use-calculator";
import { useScientificCalculator } from "@/hooks/use-scientific-calculator";
import React, { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalculatorScreen() {
  const [isDark, setIsDark] = useState(false);
  const [isScientific, setIsScientific] = useState(false);
  const colors = isDark ? Colors.dark : Colors.light;

  const basicCalc = useCalculator();
  const scientificCalc = useScientificCalculator();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Mode Toggle */}
      <View style={styles.modeToggleContainer}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            !isScientific && styles.modeButtonActive,
            {
              backgroundColor: !isScientific
                ? colors.equalsButton
                : colors.operatorButton,
            },
          ]}
          onPress={() => setIsScientific(false)}
        >
          <Text
            style={[
              styles.modeButtonText,
              { color: !isScientific ? "#FFF" : colors.buttonText },
            ]}
          >
            Basic
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            isScientific && styles.modeButtonActive,
            {
              backgroundColor: isScientific
                ? colors.equalsButton
                : colors.operatorButton,
            },
          ]}
          onPress={() => setIsScientific(true)}
        >
          <Text
            style={[
              styles.modeButtonText,
              { color: isScientific ? "#FFF" : colors.buttonText },
            ]}
          >
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
          />

          <ThemeToggle
            isDark={isDark}
            onToggle={() => setIsDark(!isDark)}
            textColor={colors.textSecondary}
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
  modeToggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 8,
  },
  modeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  modeButtonActive: {
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

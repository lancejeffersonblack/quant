import { CalculatorDisplay } from "@/components/calculator/calculator-display";
import { CalculatorKeypad } from "@/components/calculator/calculator-keypad";
import { ModeDrawer, ModeDrawerRef } from "@/components/calculator/mode-drawer";
import { ScientificDisplay } from "@/components/calculator/scientific-display";
import { ScientificKeypad } from "@/components/calculator/scientific-keypad";
import { Colors } from "@/constants/theme";
import { useCalculator } from "@/hooks/use-calculator";
import { useScientificCalculator } from "@/hooks/use-scientific-calculator";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalculatorScreen() {
  const [isDark, setIsDark] = useState(true);
  const [isScientific, setIsScientific] = useState(false);
  const colors = isDark ? Colors.dark : Colors.light;
  const drawerRef = useRef<ModeDrawerRef>(null);

  const basicCalc = useCalculator();
  const scientificCalc = useScientificCalculator();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => drawerRef.current?.open()}
              style={styles.menuButton}
            >
              <Ionicons
                name="menu-outline"
                size={24}
                color={isDark ? "#FFF" : colors.buttonText}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.title,
                { color: isDark ? "#FFF" : colors.buttonText },
              ]}
            >
              Quant Calculator
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsDark(!isDark)}
            style={styles.themeButton}
          >
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={22}
              color={isDark ? "#FFF" : colors.buttonText}
            />
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

        {/* Side Drawer */}
        <ModeDrawer
          ref={drawerRef}
          isScientific={isScientific}
          onModeChange={setIsScientific}
          isDark={isDark}
          colors={{
            background: colors.background,
            displayCard: colors.displayCard,
            buttonText: colors.buttonText,
          }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
  },
  themeButton: {
    padding: 8,
  },
});

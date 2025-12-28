import { CalculatorDisplay } from "@/components/calculator/calculator-display";
import { CalculatorKeypad } from "@/components/calculator/calculator-keypad";
import { ConstantsDisplay } from "@/components/calculator/constants-display";
import { FormulaDisplay } from "@/components/calculator/formula-display";
import { FormulaKeypad } from "@/components/calculator/formula-keypad";
import {
  CalculatorMode,
  ModeDrawer,
  ModeDrawerRef,
} from "@/components/calculator/mode-drawer";
import { ScientificDisplay } from "@/components/calculator/scientific-display";
import { ScientificKeypad } from "@/components/calculator/scientific-keypad";
import { Colors } from "@/constants/theme";
import { useCalculator } from "@/hooks/use-calculator";
import { useFormulaCalculator } from "@/hooks/use-formula-calculator";
import { useScientificCalculator } from "@/hooks/use-scientific-calculator";
import { useCalculatorStore } from "@/stores/calculator-store";
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
  const [mode, setMode] = useState<CalculatorMode>("basic");
  const [previousMode, setPreviousMode] = useState<CalculatorMode>("basic");
  const [isAddingConstant, setIsAddingConstant] = useState(false);
  const [newConstant, setNewConstant] = useState({ name: "", value: "", symbol: "" });
  const colors = isDark ? Colors.dark : Colors.light;
  const drawerRef = useRef<ModeDrawerRef>(null);

  const basicCalc = useCalculator();
  const scientificCalc = useScientificCalculator();
  const formulaCalc = useFormulaCalculator();
  
  const { 
    getAllConstants, 
    userConstants, 
    addConstant, 
    removeConstant,
    setPendingInsert 
  } = useCalculatorStore();

  const handleModeChange = (newMode: CalculatorMode) => {
    if (newMode === "constants") {
      setPreviousMode(mode === "constants" ? previousMode : mode);
    }
    setMode(newMode);
  };

  const handleConstantSelect = (constant: { value: string }) => {
    setPendingInsert(constant.value);
    // Go back to previous calculator mode
    setMode(previousMode === "formula" ? "basic" : previousMode);
  };

  const handleSaveConstant = () => {
    if (newConstant.name && newConstant.value && newConstant.symbol) {
      addConstant(newConstant.name, newConstant.value, newConstant.symbol);
      setNewConstant({ name: "", value: "", symbol: "" });
      setIsAddingConstant(false);
    }
  };

  const renderContent = () => {
    switch (mode) {
      case "scientific":
        return (
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
        );

      case "formula":
        return (
          <>
            <FormulaDisplay
              formula={formulaCalc.selectedFormula}
              variables={formulaCalc.variables}
              activeVariable={formulaCalc.activeVariable}
              result={formulaCalc.result}
              textColor={colors.text}
              secondaryTextColor={colors.textSecondary}
              cardBackgroundColor={colors.displayCard}
              accentColor={colors.equalsButton}
              onVariableSelect={formulaCalc.setActiveVariable}
            />
            <FormulaKeypad
              colors={{
                clearButton: colors.clearButton,
                operatorButton: colors.operatorButton,
                functionButton: colors.functionButton,
                numberButton: colors.numberButton,
                equalsButton: colors.equalsButton,
                buttonText: colors.buttonText,
                operatorText: colors.operatorText,
              }}
              formulas={formulaCalc.formulas}
              selectedFormula={formulaCalc.selectedFormula}
              onSelectFormula={formulaCalc.selectFormula}
              onNumber={formulaCalc.handleNumber}
              onBackspace={formulaCalc.handleBackspace}
              onClear={formulaCalc.handleClear}
              onPlusMinus={formulaCalc.handlePlusMinus}
              onCalculate={formulaCalc.calculate}
              onNextVariable={formulaCalc.nextVariable}
              onClearFormula={formulaCalc.clearFormula}
            />
          </>
        );

      case "constants":
        return (
          <ConstantsDisplay
            constants={getAllConstants()}
            userConstants={userConstants}
            isAdding={isAddingConstant}
            newConstant={newConstant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            cardBackgroundColor={colors.displayCard}
            accentColor={colors.equalsButton}
            onConstantSelect={handleConstantSelect}
            onDeleteConstant={removeConstant}
            onStartAdding={() => setIsAddingConstant(true)}
            onCancelAdding={() => {
              setIsAddingConstant(false);
              setNewConstant({ name: "", value: "", symbol: "" });
            }}
            onNewConstantChange={(field: 'name' | 'value' | 'symbol', value: string) => 
              setNewConstant(prev => ({ ...prev, [field]: value }))
            }
            onSaveConstant={handleSaveConstant}
          />
        );

      default:
        return (
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
        );
    }
  };

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

        {renderContent()}

        {/* Side Drawer */}
        <ModeDrawer
          ref={drawerRef}
          mode={mode}
          onModeChange={handleModeChange}
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

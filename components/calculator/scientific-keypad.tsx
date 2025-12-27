import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CalculatorButton } from './calculator-button';

interface ScientificKeypadProps {
  colors: {
    clearButton: string;
    operatorButton: string;
    functionButton: string;
    numberButton: string;
    equalsButton: string;
    minusButton: string;
    plusButton: string;
    buttonText: string;
    operatorText: string;
  };
  angleMode: 'DEG' | 'RAD';
  onNumber: (num: string) => void;
  onOperator: (op: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  onFraction: () => void;
  onPower: () => void;
  onSquareRoot: () => void;
  onNthRoot: () => void;
  onTrig: (func: string) => void;
  onLog: (withBase: boolean) => void;
  onParenthesis: () => void;
  onAbs: () => void;
  onVariable: (name: string) => void;
  onNavigateLeft: () => void;
  onNavigateRight: () => void;
  onToggleAngleMode: () => void;
}

export function ScientificKeypad({
  colors,
  angleMode,
  onNumber,
  onOperator,
  onClear,
  onBackspace,
  onEquals,
  onFraction,
  onPower,
  onSquareRoot,
  onNthRoot,
  onTrig,
  onLog,
  onParenthesis,
  onAbs,
  onVariable,
  onNavigateLeft,
  onNavigateRight,
  onToggleAngleMode,
}: ScientificKeypadProps) {
  const [showSecond, setShowSecond] = useState(false);

  const SmallButton = ({ label, onPress, bg }: { label: string; onPress: () => void; bg: string }) => (
    <TouchableOpacity
      style={[styles.smallButton, { backgroundColor: bg }]}
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
      activeOpacity={0.7}
    >
      <Text style={[styles.smallButtonText, { color: colors.buttonText }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Scientific functions row 1 */}
      <View style={styles.row}>
        <SmallButton label={showSecond ? "2nd" : "2nd"} onPress={() => setShowSecond(!showSecond)} bg={showSecond ? colors.equalsButton : colors.functionButton} />
        <SmallButton label={angleMode} onPress={onToggleAngleMode} bg={colors.functionButton} />
        <SmallButton label={showSecond ? "sin⁻¹" : "sin"} onPress={() => onTrig(showSecond ? 'asin' : 'sin')} bg={colors.functionButton} />
        <SmallButton label={showSecond ? "cos⁻¹" : "cos"} onPress={() => onTrig(showSecond ? 'acos' : 'cos')} bg={colors.functionButton} />
        <SmallButton label={showSecond ? "tan⁻¹" : "tan"} onPress={() => onTrig(showSecond ? 'atan' : 'tan')} bg={colors.functionButton} />
      </View>

      {/* Scientific functions row 2 */}
      <View style={styles.row}>
        <SmallButton label="x²" onPress={() => { onPower(); onNumber('2'); onNavigateRight(); }} bg={colors.functionButton} />
        <SmallButton label="xʸ" onPress={onPower} bg={colors.functionButton} />
        <SmallButton label="log" onPress={() => onLog(false)} bg={colors.functionButton} />
        <SmallButton label="logₓ" onPress={() => onLog(true)} bg={colors.functionButton} />
        <SmallButton label="ln" onPress={() => { onLog(true); onNumber('e'); onNavigateRight(); }} bg={colors.functionButton} />
      </View>

      {/* Scientific functions row 3 */}
      <View style={styles.row}>
        <SmallButton label="√" onPress={onSquareRoot} bg={colors.functionButton} />
        <SmallButton label="ⁿ√" onPress={onNthRoot} bg={colors.functionButton} />
        <SmallButton label="a/b" onPress={onFraction} bg={colors.functionButton} />
        <SmallButton label="|x|" onPress={onAbs} bg={colors.functionButton} />
        <SmallButton label="π" onPress={() => onNumber('3.14159265359')} bg={colors.functionButton} />
      </View>

      {/* Navigation and variables */}
      <View style={styles.row}>
        <SmallButton label="◀" onPress={onNavigateLeft} bg={colors.operatorButton} />
        <SmallButton label="▶" onPress={onNavigateRight} bg={colors.operatorButton} />
        <SmallButton label="x" onPress={() => onVariable('x')} bg={colors.functionButton} />
        <SmallButton label="y" onPress={() => onVariable('y')} bg={colors.functionButton} />
        <SmallButton label="e" onPress={() => onNumber('2.71828182846')} bg={colors.functionButton} />
      </View>

      {/* Main keypad */}
      <View style={styles.mainKeypad}>
        {/* Row 1: C, (, ), × */}
        <View style={styles.mainRow}>
          <CalculatorButton label="C" onPress={onClear} backgroundColor={colors.clearButton} textColor="#FFFFFF" />
          <CalculatorButton label="(" onPress={onParenthesis} backgroundColor={colors.operatorButton} textColor={colors.operatorText} />
          <CalculatorButton label=")" onPress={onNavigateRight} backgroundColor={colors.operatorButton} textColor={colors.operatorText} />
          <CalculatorButton label="×" onPress={() => onOperator('×')} backgroundColor={colors.operatorButton} textColor={colors.operatorText} />
        </View>

        {/* Row 2: 7, 8, 9, ÷ */}
        <View style={styles.mainRow}>
          <CalculatorButton label="7" onPress={() => onNumber('7')} backgroundColor={colors.numberButton} textColor={colors.buttonText} />
          <CalculatorButton label="8" onPress={() => onNumber('8')} backgroundColor={colors.numberButton} textColor={colors.buttonText} />
          <CalculatorButton label="9" onPress={() => onNumber('9')} backgroundColor={colors.numberButton} textColor={colors.buttonText} />
          <CalculatorButton label="÷" onPress={() => onOperator('÷')} backgroundColor={colors.functionButton} textColor={colors.operatorText} />
        </View>

        {/* Row 3: 4, 5, 6, - */}
        <View style={styles.mainRow}>
          <CalculatorButton label="4" onPress={() => onNumber('4')} backgroundColor={colors.numberButton} textColor={colors.buttonText} />
          <CalculatorButton label="5" onPress={() => onNumber('5')} backgroundColor={colors.numberButton} textColor={colors.buttonText} />
          <CalculatorButton label="6" onPress={() => onNumber('6')} backgroundColor={colors.numberButton} textColor={colors.buttonText} />
          <CalculatorButton label="−" onPress={() => onOperator('−')} backgroundColor={colors.minusButton} textColor={colors.operatorText} />
        </View>

        {/* Row 4: 1, 2, 3, + */}
        <View style={styles.mainRow}>
          <CalculatorButton label="1" onPress={() => onNumber('1')} backgroundColor={colors.numberButton} textColor={colors.buttonText} />
          <CalculatorButton label="2" onPress={() => onNumber('2')} backgroundColor={colors.numberButton} textColor={colors.buttonText} />
          <CalculatorButton label="3" onPress={() => onNumber('3')} backgroundColor={colors.numberButton} textColor={colors.buttonText} />
          <CalculatorButton label="+" onPress={() => onOperator('+')} backgroundColor={colors.plusButton} textColor={colors.operatorText} />
        </View>

        {/* Row 5: ., 0, ⌫, = */}
        <View style={styles.mainRow}>
          <CalculatorButton label="." onPress={() => onNumber('.')} backgroundColor={colors.numberButton} textColor={colors.buttonText} />
          <CalculatorButton label="0" onPress={() => onNumber('0')} backgroundColor={colors.numberButton} textColor={colors.buttonText} />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.numberButton }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onBackspace(); }}
            activeOpacity={0.7}
          >
            <Ionicons name="backspace-outline" size={24} color={colors.buttonText} />
          </TouchableOpacity>
          <CalculatorButton label="=" onPress={onEquals} backgroundColor={colors.equalsButton} textColor="#FFFFFF" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  smallButton: {
    flex: 1,
    height: 40,
    marginHorizontal: 3,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  smallButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mainKeypad: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
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
});

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CalculatorButton } from './calculator-button';

import * as Haptics from 'expo-haptics';

interface CalculatorKeypadProps {
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
  onNumber: (num: string) => void;
  onOperator: (op: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  onParenthesis: (paren: string) => void;
  onSquareRoot: () => void;
  onPercent: () => void;
  onPlusMinus: () => void;
}

export function CalculatorKeypad({
  colors,
  onNumber,
  onOperator,
  onClear,
  onBackspace,
  onEquals,
  onParenthesis,
  onSquareRoot,
  onPercent,
  onPlusMinus,
}: CalculatorKeypadProps) {
  const handleBackspace = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBackspace();
  };

  return (
    <View style={styles.container}>
      {/* Row 1: C, (, ), × */}
      <View style={styles.row}>
        <CalculatorButton
          label="C"
          onPress={onClear}
          backgroundColor={colors.clearButton}
          textColor="#FFFFFF"
        />
        <CalculatorButton
          label="("
          onPress={() => onParenthesis('(')}
          backgroundColor={colors.operatorButton}
          textColor={colors.operatorText}
        />
        <CalculatorButton
          label=")"
          onPress={() => onParenthesis(')')}
          backgroundColor={colors.operatorButton}
          textColor={colors.operatorText}
        />
        <CalculatorButton
          label="×"
          onPress={() => onOperator('×')}
          backgroundColor={colors.operatorButton}
          textColor={colors.operatorText}
        />
      </View>

      {/* Row 2: √, %, ±, ÷ */}
      <View style={styles.row}>
        <CalculatorButton
          label="√"
          onPress={onSquareRoot}
          backgroundColor={colors.functionButton}
          textColor={colors.operatorText}
        />
        <CalculatorButton
          label="%"
          onPress={onPercent}
          backgroundColor={colors.functionButton}
          textColor={colors.operatorText}
        />
        <CalculatorButton
          label="±"
          onPress={onPlusMinus}
          backgroundColor={colors.functionButton}
          textColor={colors.operatorText}
        />
        <CalculatorButton
          label="÷"
          onPress={() => onOperator('÷')}
          backgroundColor={colors.functionButton}
          textColor={colors.operatorText}
        />
      </View>

      {/* Row 3: 7, 8, 9, - */}
      <View style={styles.row}>
        <CalculatorButton
          label="7"
          onPress={() => onNumber('7')}
          backgroundColor={colors.numberButton}
          textColor={colors.buttonText}
        />
        <CalculatorButton
          label="8"
          onPress={() => onNumber('8')}
          backgroundColor={colors.numberButton}
          textColor={colors.buttonText}
        />
        <CalculatorButton
          label="9"
          onPress={() => onNumber('9')}
          backgroundColor={colors.numberButton}
          textColor={colors.buttonText}
        />
        <CalculatorButton
          label="−"
          onPress={() => onOperator('−')}
          backgroundColor={colors.minusButton}
          textColor={colors.operatorText}
        />
      </View>

      {/* Row 4: 4, 5, 6, + */}
      <View style={styles.row}>
        <CalculatorButton
          label="4"
          onPress={() => onNumber('4')}
          backgroundColor={colors.numberButton}
          textColor={colors.buttonText}
        />
        <CalculatorButton
          label="5"
          onPress={() => onNumber('5')}
          backgroundColor={colors.numberButton}
          textColor={colors.buttonText}
        />
        <CalculatorButton
          label="6"
          onPress={() => onNumber('6')}
          backgroundColor={colors.numberButton}
          textColor={colors.buttonText}
        />
        <CalculatorButton
          label="+"
          onPress={() => onOperator('+')}
          backgroundColor={colors.plusButton}
          textColor={colors.operatorText}
        />
      </View>

      {/* Row 5 & 6: 1-3, =, ., 0, ⌫ */}
      <View style={styles.bottomSection}>
        <View style={styles.leftSection}>
          <View style={styles.row}>
            <CalculatorButton
              label="1"
              onPress={() => onNumber('1')}
              backgroundColor={colors.numberButton}
              textColor={colors.buttonText}
            />
            <CalculatorButton
              label="2"
              onPress={() => onNumber('2')}
              backgroundColor={colors.numberButton}
              textColor={colors.buttonText}
            />
            <CalculatorButton
              label="3"
              onPress={() => onNumber('3')}
              backgroundColor={colors.numberButton}
              textColor={colors.buttonText}
            />
          </View>
          <View style={styles.row}>
            <CalculatorButton
              label="."
              onPress={() => onNumber('.')}
              backgroundColor={colors.numberButton}
              textColor={colors.buttonText}
            />
            <CalculatorButton
              label="0"
              onPress={() => onNumber('0')}
              backgroundColor={colors.numberButton}
              textColor={colors.buttonText}
            />
            <TouchableOpacity
              style={[styles.backspaceButton, { backgroundColor: colors.numberButton }]}
              onPress={handleBackspace}
              activeOpacity={0.7}
            >
              <Ionicons name="backspace-outline" size={24} color={colors.buttonText} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.equalsContainer}>
          <CalculatorButton
            label="="
            onPress={onEquals}
            backgroundColor={colors.equalsButton}
            textColor="#FFFFFF"
            isDouble
            textStyle={{ fontSize: 32 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    marginRight: 10,
  },
  equalsContainer: {
    justifyContent: 'flex-start',
  },
  backspaceButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

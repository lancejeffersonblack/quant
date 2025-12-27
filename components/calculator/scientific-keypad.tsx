import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  onTrig,
  onLog,
  onParenthesis,
  onAbs,
  onNavigateLeft,
  onNavigateRight,
  onToggleAngleMode,
}: ScientificKeypadProps) {
  const [showSecond, setShowSecond] = useState(false);

  const press = (fn: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  const SmallBtn = ({ label, onPress, active = false }: { 
    label: string; 
    onPress: () => void;
    active?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.smallButton, { backgroundColor: active ? colors.equalsButton : colors.functionButton }]}
      onPress={() => press(onPress)}
      activeOpacity={0.7}
    >
      <Text style={[styles.smallButtonText, { color: active ? '#FFF' : colors.buttonText }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const Btn = ({ label, onPress, isEquals = false }: { 
    label: string | React.ReactNode; 
    onPress: () => void;
    isEquals?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: isEquals ? colors.equalsButton : colors.numberButton }]}
      onPress={() => press(onPress)}
      activeOpacity={0.7}
    >
      {typeof label === 'string' ? (
        <Text style={[styles.buttonText, { color: isEquals ? '#FFF' : colors.buttonText }]}>
          {label}
        </Text>
      ) : label}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Scientific row 1 */}
      <View style={styles.smallRow}>
        <SmallBtn label="2nd" onPress={() => setShowSecond(!showSecond)} active={showSecond} />
        <SmallBtn label={angleMode} onPress={onToggleAngleMode} />
        <SmallBtn label={showSecond ? 'sin⁻¹' : 'sin'} onPress={() => onTrig(showSecond ? 'asin' : 'sin')} />
        <SmallBtn label={showSecond ? 'cos⁻¹' : 'cos'} onPress={() => onTrig(showSecond ? 'acos' : 'cos')} />
        <SmallBtn label={showSecond ? 'tan⁻¹' : 'tan'} onPress={() => onTrig(showSecond ? 'atan' : 'tan')} />
      </View>

      {/* Scientific row 2 */}
      <View style={styles.smallRow}>
        <SmallBtn label="a/b" onPress={onFraction} />
        <SmallBtn label="xʸ" onPress={onPower} />
        <SmallBtn label="√" onPress={onSquareRoot} />
        <SmallBtn label="log" onPress={() => onLog(false)} />
        <SmallBtn label="|x|" onPress={onAbs} />
      </View>

      {/* Scientific row 3 */}
      <View style={styles.smallRow}>
        <SmallBtn label="◀" onPress={onNavigateLeft} />
        <SmallBtn label="▶" onPress={onNavigateRight} />
        <SmallBtn label="( )" onPress={onParenthesis} />
        <SmallBtn label="π" onPress={() => onNumber('3.14159265359')} />
        <SmallBtn label="e" onPress={() => onNumber('2.71828182846')} />
      </View>

      {/* Main keypad */}
      <View style={styles.mainKeypad}>
        <View style={styles.row}>
          <Btn label="=" onPress={onEquals} isEquals />
          <Btn label="÷" onPress={() => onOperator('÷')} />
          <Btn label="×" onPress={() => onOperator('×')} />
          <Btn label={<Ionicons name="backspace-outline" size={20} color={colors.buttonText} />} onPress={onBackspace} />
        </View>

        <View style={styles.row}>
          <Btn label="7" onPress={() => onNumber('7')} />
          <Btn label="8" onPress={() => onNumber('8')} />
          <Btn label="9" onPress={() => onNumber('9')} />
          <Btn label="−" onPress={() => onOperator('−')} />
        </View>

        <View style={styles.row}>
          <Btn label="4" onPress={() => onNumber('4')} />
          <Btn label="5" onPress={() => onNumber('5')} />
          <Btn label="6" onPress={() => onNumber('6')} />
          <Btn label="+" onPress={() => onOperator('+')} />
        </View>

        <View style={styles.row}>
          <Btn label="1" onPress={() => onNumber('1')} />
          <Btn label="2" onPress={() => onNumber('2')} />
          <Btn label="3" onPress={() => onNumber('3')} />
          <Btn label="%" onPress={() => onOperator('%')} />
        </View>

        <View style={styles.row}>
          <Btn label="C" onPress={onClear} />
          <Btn label="0" onPress={() => onNumber('0')} />
          <Btn label="." onPress={() => onNumber('.')} />
          <Btn label="±" onPress={() => {}} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  smallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  smallButton: {
    flex: 1,
    height: 34,
    marginHorizontal: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  smallButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  mainKeypad: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  button: {
    width: 72,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '400',
  },
});

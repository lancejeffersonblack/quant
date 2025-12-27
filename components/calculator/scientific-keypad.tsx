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

  const Btn = ({ label, onPress, bg, textColor, size = 'normal' }: { 
    label: string | React.ReactNode; 
    onPress: () => void; 
    bg: string; 
    textColor?: string;
    size?: 'small' | 'normal';
  }) => (
    <TouchableOpacity
      style={[
        size === 'small' ? styles.smallBtn : styles.btn,
        { backgroundColor: bg }
      ]}
      onPress={() => press(onPress)}
      activeOpacity={0.7}
    >
      {typeof label === 'string' ? (
        <Text style={[
          size === 'small' ? styles.smallBtnText : styles.btnText,
          { color: textColor || colors.buttonText }
        ]}>
          {label}
        </Text>
      ) : label}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Row 1: Scientific functions */}
      <View style={styles.row}>
        <Btn label="2nd" onPress={() => setShowSecond(!showSecond)} bg={showSecond ? colors.equalsButton : colors.functionButton} textColor={showSecond ? '#FFF' : undefined} size="small" />
        <Btn label={angleMode} onPress={onToggleAngleMode} bg={colors.functionButton} size="small" />
        <Btn label={showSecond ? "sin⁻¹" : "sin"} onPress={() => onTrig(showSecond ? 'asin' : 'sin')} bg={colors.functionButton} size="small" />
        <Btn label={showSecond ? "cos⁻¹" : "cos"} onPress={() => onTrig(showSecond ? 'acos' : 'cos')} bg={colors.functionButton} size="small" />
        <Btn label={showSecond ? "tan⁻¹" : "tan"} onPress={() => onTrig(showSecond ? 'atan' : 'tan')} bg={colors.functionButton} size="small" />
      </View>

      {/* Row 2: More functions */}
      <View style={styles.row}>
        <Btn label="a/b" onPress={onFraction} bg={colors.functionButton} size="small" />
        <Btn label="xʸ" onPress={onPower} bg={colors.functionButton} size="small" />
        <Btn label="√" onPress={onSquareRoot} bg={colors.functionButton} size="small" />
        <Btn label="log" onPress={() => onLog(false)} bg={colors.functionButton} size="small" />
        <Btn label="|x|" onPress={onAbs} bg={colors.functionButton} size="small" />
      </View>

      {/* Row 3: Navigation + constants */}
      <View style={styles.row}>
        <Btn label="◀" onPress={onNavigateLeft} bg={colors.operatorButton} size="small" />
        <Btn label="▶" onPress={onNavigateRight} bg={colors.operatorButton} size="small" />
        <Btn label="(" onPress={onParenthesis} bg={colors.operatorButton} size="small" />
        <Btn label="π" onPress={() => onNumber('3.14159265359')} bg={colors.functionButton} size="small" />
        <Btn label="e" onPress={() => onNumber('2.71828182846')} bg={colors.functionButton} size="small" />
      </View>

      {/* Main number pad - compact grid */}
      <View style={styles.mainGrid}>
        {/* Row: C 7 8 9 ÷ */}
        <View style={styles.mainRow}>
          <Btn label="C" onPress={onClear} bg={colors.clearButton} textColor="#FFF" />
          <Btn label="7" onPress={() => onNumber('7')} bg={colors.numberButton} />
          <Btn label="8" onPress={() => onNumber('8')} bg={colors.numberButton} />
          <Btn label="9" onPress={() => onNumber('9')} bg={colors.numberButton} />
          <Btn label="÷" onPress={() => onOperator('÷')} bg={colors.operatorButton} />
        </View>

        {/* Row: ⌫ 4 5 6 × */}
        <View style={styles.mainRow}>
          <Btn 
            label={<Ionicons name="backspace-outline" size={20} color={colors.buttonText} />} 
            onPress={onBackspace} 
            bg={colors.numberButton} 
          />
          <Btn label="4" onPress={() => onNumber('4')} bg={colors.numberButton} />
          <Btn label="5" onPress={() => onNumber('5')} bg={colors.numberButton} />
          <Btn label="6" onPress={() => onNumber('6')} bg={colors.numberButton} />
          <Btn label="×" onPress={() => onOperator('×')} bg={colors.operatorButton} />
        </View>

        {/* Row: % 1 2 3 − */}
        <View style={styles.mainRow}>
          <Btn label="%" onPress={() => onOperator('%')} bg={colors.functionButton} />
          <Btn label="1" onPress={() => onNumber('1')} bg={colors.numberButton} />
          <Btn label="2" onPress={() => onNumber('2')} bg={colors.numberButton} />
          <Btn label="3" onPress={() => onNumber('3')} bg={colors.numberButton} />
          <Btn label="−" onPress={() => onOperator('−')} bg={colors.minusButton} />
        </View>

        {/* Row: . 0 00 = + */}
        <View style={styles.mainRow}>
          <Btn label="." onPress={() => onNumber('.')} bg={colors.numberButton} />
          <Btn label="0" onPress={() => onNumber('0')} bg={colors.numberButton} />
          <Btn label="00" onPress={() => { onNumber('0'); onNumber('0'); }} bg={colors.numberButton} />
          <Btn label="=" onPress={onEquals} bg={colors.equalsButton} textColor="#FFF" />
          <Btn label="+" onPress={() => onOperator('+')} bg={colors.plusButton} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  smallBtn: {
    flex: 1,
    height: 36,
    marginHorizontal: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  smallBtnText: {
    fontSize: 13,
    fontWeight: '500',
  },
  mainGrid: {
    marginTop: 6,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  btn: {
    flex: 1,
    height: 52,
    marginHorizontal: 2,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  btnText: {
    fontSize: 20,
    fontWeight: '500',
  },
});

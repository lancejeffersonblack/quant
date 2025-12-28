import type { Formula } from '@/hooks/use-formula-calculator';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FormulaKeypadProps {
  colors: {
    clearButton: string;
    operatorButton: string;
    functionButton: string;
    numberButton: string;
    equalsButton: string;
    buttonText: string;
    operatorText: string;
  };
  formulas: Formula[];
  selectedFormula: Formula | null;
  onSelectFormula: (formula: Formula) => void;
  onNumber: (num: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onPlusMinus: () => void;
  onCalculate: () => void;
  onNextVariable: () => void;
  onClearFormula: () => void;
}

export function FormulaKeypad({
  colors,
  formulas,
  selectedFormula,
  onSelectFormula,
  onNumber,
  onBackspace,
  onClear,
  onPlusMinus,
  onCalculate,
  onNextVariable,
  onClearFormula,
}: FormulaKeypadProps) {
  const press = (fn: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  // Show formula selection if no formula selected
  if (!selectedFormula) {
    return (
      <View style={styles.container}>
        <Text style={[styles.sectionTitle, { color: colors.buttonText }]}>
          Select a Formula
        </Text>
        <ScrollView 
          style={styles.formulaList}
          contentContainerStyle={styles.formulaListContent}
          showsVerticalScrollIndicator={false}
        >
          {formulas.map((formula) => (
            <TouchableOpacity
              key={formula.id}
              style={[styles.formulaCard, { backgroundColor: colors.functionButton }]}
              onPress={() => press(() => onSelectFormula(formula))}
              activeOpacity={0.7}
            >
              <Text style={[styles.formulaName, { color: colors.buttonText }]}>
                {formula.name}
              </Text>
              <Text style={[styles.formulaDesc, { color: colors.buttonText, opacity: 0.7 }]}>
                {formula.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Show number pad for entering values
  const Btn = ({ label, onPress, bg, isWide = false }: { 
    label: string | React.ReactNode; 
    onPress: () => void;
    bg: string;
    isWide?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.button, 
        { backgroundColor: bg },
        isWide && styles.wideButton,
      ]}
      onPress={() => press(onPress)}
      activeOpacity={0.7}
    >
      {typeof label === 'string' ? (
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>{label}</Text>
      ) : label}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Formula info bar */}
      <View style={styles.formulaBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => press(onClearFormula)}
        >
          <Ionicons name="arrow-back" size={20} color={colors.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.currentFormula, { color: colors.buttonText }]}>
          {selectedFormula.name}
        </Text>
        <TouchableOpacity 
          style={[styles.nextButton, { backgroundColor: colors.operatorButton }]}
          onPress={() => press(onNextVariable)}
        >
          <Text style={[styles.nextButtonText, { color: colors.operatorText }]}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Number pad */}
      <View style={styles.keypad}>
        <View style={styles.row}>
          <Btn label="C" onPress={onClear} bg={colors.clearButton} />
          <Btn label="±" onPress={onPlusMinus} bg={colors.functionButton} />
          <Btn 
            label={<Ionicons name="backspace-outline" size={22} color={colors.buttonText} />} 
            onPress={onBackspace} 
            bg={colors.functionButton} 
          />
        </View>

        <View style={styles.row}>
          <Btn label="7" onPress={() => onNumber('7')} bg={colors.numberButton} />
          <Btn label="8" onPress={() => onNumber('8')} bg={colors.numberButton} />
          <Btn label="9" onPress={() => onNumber('9')} bg={colors.numberButton} />
        </View>

        <View style={styles.row}>
          <Btn label="4" onPress={() => onNumber('4')} bg={colors.numberButton} />
          <Btn label="5" onPress={() => onNumber('5')} bg={colors.numberButton} />
          <Btn label="6" onPress={() => onNumber('6')} bg={colors.numberButton} />
        </View>

        <View style={styles.row}>
          <Btn label="1" onPress={() => onNumber('1')} bg={colors.numberButton} />
          <Btn label="2" onPress={() => onNumber('2')} bg={colors.numberButton} />
          <Btn label="3" onPress={() => onNumber('3')} bg={colors.numberButton} />
        </View>

        <View style={styles.row}>
          <Btn label="0" onPress={() => onNumber('0')} bg={colors.numberButton} />
          <Btn label="." onPress={() => onNumber('.')} bg={colors.numberButton} />
          <Btn label="=" onPress={onCalculate} bg={colors.equalsButton} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  formulaList: {
    maxHeight: 350,
  },
  formulaListContent: {
    gap: 10,
    paddingBottom: 16,
  },
  formulaCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formulaName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  formulaDesc: {
    fontSize: 13,
  },
  formulaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  currentFormula: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  keypad: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    width: 80,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wideButton: {
    width: 170,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '400',
  },
});

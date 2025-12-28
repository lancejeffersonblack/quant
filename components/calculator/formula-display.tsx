import type { Formula, FormulaVariable } from '@/hooks/use-formula-calculator';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FormulaDisplayProps {
  formula: Formula | null;
  variables: FormulaVariable[];
  activeVariable: string | null;
  result: string;
  textColor: string;
  secondaryTextColor: string;
  cardBackgroundColor: string;
  accentColor: string;
  onVariableSelect: (name: string) => void;
}

export function FormulaDisplay({
  formula,
  variables,
  activeVariable,
  result,
  textColor,
  secondaryTextColor,
  cardBackgroundColor,
  accentColor,
  onVariableSelect,
}: FormulaDisplayProps) {
  if (!formula) {
    return (
      <View style={styles.container}>
        <View style={[styles.displayCard, { backgroundColor: cardBackgroundColor }]}>
          <Text style={[styles.placeholder, { color: secondaryTextColor }]}>
            Select a formula from the keypad below
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.displayCard, { backgroundColor: cardBackgroundColor }]}>
        {/* Formula name and equation */}
        <View style={styles.formulaHeader}>
          <Text style={[styles.formulaName, { color: textColor }]}>{formula.name}</Text>
          <Text style={[styles.formulaEquation, { color: secondaryTextColor }]}>
            {formula.displayFormula}
          </Text>
        </View>

        {/* Variables input */}
        <ScrollView 
          horizontal 
          style={styles.variablesContainer}
          contentContainerStyle={styles.variablesContent}
          showsHorizontalScrollIndicator={false}
        >
          {variables.map((v) => (
            <TouchableOpacity
              key={v.name}
              style={[
                styles.variableBox,
                { 
                  borderColor: activeVariable === v.name ? accentColor : secondaryTextColor,
                  borderWidth: activeVariable === v.name ? 2 : 1,
                },
              ]}
              onPress={() => onVariableSelect(v.name)}
            >
              <Text style={[styles.variableLabel, { color: secondaryTextColor }]}>
                {v.label}
              </Text>
              <Text 
                style={[
                  styles.variableValue, 
                  { color: v.value ? textColor : secondaryTextColor }
                ]}
                numberOfLines={1}
              >
                {v.value || '?'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Result */}
        <View style={styles.resultContainer}>
          <Text 
            style={[styles.resultText, { color: textColor }]} 
            numberOfLines={2} 
            adjustsFontSizeToFit
          >
            {result || '—'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  displayCard: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  placeholder: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
  },
  formulaHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  formulaName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  formulaEquation: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  variablesContainer: {
    maxHeight: 80,
  },
  variablesContent: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  variableBox: {
    minWidth: 60,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  variableLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  variableValue: {
    fontSize: 20,
    fontWeight: '400',
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  resultText: {
    fontSize: 32,
    fontWeight: '300',
    textAlign: 'center',
  },
});

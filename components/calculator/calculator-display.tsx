import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CalculatorDisplayProps {
  result: string;
  history: string[];
  currentExpression: string;
  textColor: string;
  secondaryTextColor: string;
  backgroundColor: string;
  cardBackgroundColor: string;
}

export function CalculatorDisplay({
  result,
  currentExpression,
  textColor,
  secondaryTextColor,
  cardBackgroundColor,
}: CalculatorDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.displayCard, { backgroundColor: cardBackgroundColor }]}>
        {/* Expression at top right */}
        <View style={styles.expressionContainer}>
          <Text style={[styles.expressionText, { color: secondaryTextColor }]} numberOfLines={1}>
            {currentExpression || ''}
          </Text>
        </View>
        
        {/* Large result number */}
        <View style={styles.resultContainer}>
          <Text 
            style={[styles.resultText, { color: textColor }]} 
            numberOfLines={1} 
            adjustsFontSizeToFit
          >
            {result}
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
    paddingBottom: 16,
    justifyContent: 'center',
  },
  displayCard: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  expressionContainer: {
    alignItems: 'flex-end',
  },
  expressionText: {
    fontSize: 16,
    fontWeight: '400',
  },
  resultContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
  },
  resultText: {
    fontSize: 72,
    fontWeight: '300',
    letterSpacing: -2,
  },
});

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface CalculatorDisplayProps {
  result: string;
  history: string[];
  currentExpression: string;
  textColor: string;
  secondaryTextColor: string;
}

export function CalculatorDisplay({
  result,
  history,
  currentExpression,
  textColor,
  secondaryTextColor,
}: CalculatorDisplayProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.historyContainer}
        contentContainerStyle={styles.historyContent}
        showsVerticalScrollIndicator={false}
      >
        {history.map((item, index) => (
          <Text key={index} style={[styles.historyText, { color: secondaryTextColor }]}>
            {item}
          </Text>
        ))}
        {currentExpression && (
          <Text style={[styles.expressionText, { color: secondaryTextColor }]}>
            {currentExpression}
          </Text>
        )}
      </ScrollView>
      <View style={styles.resultContainer}>
        <Text style={[styles.equalsSign, { color: secondaryTextColor }]}>=</Text>
        <Text style={[styles.resultText, { color: textColor }]} numberOfLines={1} adjustsFontSizeToFit>
          {result}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: 'flex-end',
  },
  historyContainer: {
    flex: 1,
    maxHeight: 160,
  },
  historyContent: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  historyText: {
    fontSize: 18,
    textAlign: 'right',
    marginBottom: 6,
  },
  expressionText: {
    fontSize: 22,
    textAlign: 'right',
    marginBottom: 12,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
  equalsSign: {
    fontSize: 36,
    marginRight: 12,
  },
  resultText: {
    fontSize: 64,
    fontWeight: '300',
  },
});

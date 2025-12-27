import type { CursorPosition, MathNode } from '@/hooks/use-scientific-calculator';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MathRenderer } from './math-renderer';

interface ScientificDisplayProps {
  expression: MathNode[];
  cursor: CursorPosition;
  result: string;
  history: { expr: MathNode[]; result: string }[];
  textColor: string;
  secondaryTextColor: string;
  angleMode: 'DEG' | 'RAD';
  cardBackgroundColor: string;
}

export function ScientificDisplay({
  expression,
  cursor,
  result,
  textColor,
  secondaryTextColor,
  angleMode,
  cardBackgroundColor,
}: ScientificDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.displayCard, { backgroundColor: cardBackgroundColor }]}>
        {/* Mode and expression at top */}
        <View style={styles.topRow}>
          <Text style={[styles.modeText, { color: secondaryTextColor }]}>{angleMode}</Text>
        </View>

        {/* Expression area */}
        <ScrollView 
          horizontal 
          style={styles.expressionContainer}
          contentContainerStyle={styles.expressionContent}
          showsHorizontalScrollIndicator={false}
        >
          {expression.length > 0 ? (
            <MathRenderer
              nodes={expression}
              cursor={cursor}
              currentPath={[]}
              textColor={secondaryTextColor}
              placeholderColor={secondaryTextColor}
              fontSize={18}
            />
          ) : null}
        </ScrollView>

        {/* Large result */}
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  expressionContainer: {
    maxHeight: 50,
    marginTop: 8,
  },
  expressionContent: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  resultText: {
    fontSize: 56,
    fontWeight: '300',
    letterSpacing: -1,
  },
});

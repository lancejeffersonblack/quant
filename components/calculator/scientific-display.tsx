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
}

export function ScientificDisplay({
  expression,
  cursor,
  result,
  history,
  textColor,
  secondaryTextColor,
  angleMode,
}: ScientificDisplayProps) {
  return (
    <View style={styles.container}>
      {/* Mode indicator */}
      <View style={styles.modeIndicator}>
        <Text style={[styles.modeText, { color: secondaryTextColor }]}>{angleMode}</Text>
      </View>

      {/* History */}
      <ScrollView 
        style={styles.historyContainer}
        contentContainerStyle={styles.historyContent}
        showsVerticalScrollIndicator={false}
      >
        {history.map((item, index) => (
          <View key={index} style={styles.historyItem}>
            <View style={styles.historyExpr}>
              <MathRenderer
                nodes={item.expr}
                cursor={{ path: [], index: -1 }}
                currentPath={[]}
                textColor={secondaryTextColor}
                placeholderColor={secondaryTextColor}
                fontSize={14}
              />
            </View>
            <Text style={[styles.historyResult, { color: secondaryTextColor }]}>
              = {item.result}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Current expression */}
      <ScrollView 
        horizontal 
        style={styles.expressionContainer}
        contentContainerStyle={styles.expressionContent}
        showsHorizontalScrollIndicator={false}
      >
        <MathRenderer
          nodes={expression}
          cursor={cursor}
          currentPath={[]}
          textColor={textColor}
          placeholderColor={secondaryTextColor}
          fontSize={28}
        />
        {expression.length === 0 && (
          <View style={[styles.emptyCursor, { backgroundColor: '#8B5CF6' }]} />
        )}
      </ScrollView>

      {/* Result */}
      <View style={styles.resultContainer}>
        <Text style={[styles.equalsSign, { color: secondaryTextColor }]}>=</Text>
        <Text 
          style={[styles.resultText, { color: textColor }]} 
          numberOfLines={1} 
          adjustsFontSizeToFit
        >
          {result}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  modeIndicator: {
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  modeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  historyContainer: {
    maxHeight: 80,
  },
  historyContent: {
    alignItems: 'flex-end',
  },
  historyItem: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  historyExpr: {
    flexDirection: 'row',
  },
  historyResult: {
    fontSize: 12,
    marginTop: 2,
  },
  expressionContainer: {
    maxHeight: 80,
    marginVertical: 8,
  },
  expressionContent: {
    alignItems: 'center',
    paddingRight: 20,
  },
  emptyCursor: {
    width: 2,
    height: 32,
    borderRadius: 1,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  equalsSign: {
    fontSize: 28,
    marginRight: 8,
  },
  resultText: {
    fontSize: 42,
    fontWeight: '300',
  },
});

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
                fontSize={16}
              />
            </View>
            <Text style={[styles.historyResult, { color: secondaryTextColor }]}>
              = {item.result}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Current expression - larger area */}
      <View style={styles.expressionWrapper}>
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
              textColor={textColor}
              placeholderColor={secondaryTextColor}
              fontSize={32}
            />
          ) : (
            <View style={styles.emptyExpression}>
              <View style={[styles.cursor, { backgroundColor: '#8B5CF6' }]} />
              <Text style={[styles.placeholderText, { color: secondaryTextColor }]}>
                Enter expression
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

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
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  modeIndicator: {
    alignItems: 'flex-end',
    paddingRight: 4,
  },
  modeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  historyContainer: {
    maxHeight: 100,
    marginBottom: 8,
  },
  historyContent: {
    alignItems: 'flex-end',
  },
  historyItem: {
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  historyExpr: {
    flexDirection: 'row',
  },
  historyResult: {
    fontSize: 14,
    marginTop: 2,
  },
  expressionWrapper: {
    flex: 1,
    minHeight: 80,
    justifyContent: 'center',
  },
  expressionContainer: {
    flexGrow: 0,
  },
  expressionContent: {
    alignItems: 'center',
    paddingRight: 20,
    minHeight: 60,
  },
  emptyExpression: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cursor: {
    width: 2,
    height: 36,
    borderRadius: 1,
    marginRight: 4,
  },
  placeholderText: {
    fontSize: 18,
    fontStyle: 'italic',
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 12,
    minHeight: 60,
  },
  equalsSign: {
    fontSize: 32,
    marginRight: 10,
  },
  resultText: {
    fontSize: 52,
    fontWeight: '300',
  },
});

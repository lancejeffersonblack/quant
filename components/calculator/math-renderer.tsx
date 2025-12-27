import type { CursorPosition, MathNode } from '@/hooks/use-scientific-calculator';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MathRendererProps {
  nodes: MathNode[];
  cursor: CursorPosition;
  currentPath: number[];
  textColor: string;
  placeholderColor: string;
  fontSize?: number;
}

export function MathRenderer({
  nodes,
  cursor,
  currentPath,
  textColor,
  placeholderColor,
  fontSize = 24,
}: MathRendererProps) {
  const isAtCursor = (path: number[], index: number) => {
    return JSON.stringify(cursor.path) === JSON.stringify(path) && cursor.index === index;
  };

  const renderCursor = () => (
    <View style={[styles.cursor, { height: fontSize * 1.2, backgroundColor: '#8B5CF6' }]} />
  );

  const renderNode = (node: MathNode, index: number, path: number[]): React.ReactNode => {
    const nodePath = [...path, index];
    
    switch (node.type) {
      case 'number':
        return (
          <Text key={index} style={[styles.number, { color: textColor, fontSize }]}>
            {node.value}
          </Text>
        );
      
      case 'variable':
        return (
          <Text key={index} style={[styles.variable, { color: '#8B5CF6', fontSize, fontStyle: 'italic' }]}>
            {node.name}
          </Text>
        );
      
      case 'operator':
        return (
          <Text key={index} style={[styles.operator, { color: textColor, fontSize }]}>
            {' '}{node.op}{' '}
          </Text>
        );
      
      case 'placeholder':
        return (
          <View key={index} style={[styles.placeholder, { borderColor: placeholderColor }]}>
            <Text style={[styles.placeholderText, { color: placeholderColor, fontSize: fontSize * 0.7 }]}>□</Text>
          </View>
        );
      
      case 'fraction':
        return (
          <View key={index} style={styles.fraction}>
            <View style={styles.fractionNumerator}>
              <MathRenderer
                nodes={node.numerator}
                cursor={cursor}
                currentPath={[...nodePath, 0]}
                textColor={textColor}
                placeholderColor={placeholderColor}
                fontSize={fontSize * 0.85}
              />
            </View>
            <View style={[styles.fractionLine, { backgroundColor: textColor }]} />
            <View style={styles.fractionDenominator}>
              <MathRenderer
                nodes={node.denominator}
                cursor={cursor}
                currentPath={[...nodePath, 1]}
                textColor={textColor}
                placeholderColor={placeholderColor}
                fontSize={fontSize * 0.85}
              />
            </View>
          </View>
        );
      
      case 'power':
        return (
          <View key={index} style={styles.power}>
            <View style={styles.powerBase}>
              <MathRenderer
                nodes={node.base}
                cursor={cursor}
                currentPath={[...nodePath, 0]}
                textColor={textColor}
                placeholderColor={placeholderColor}
                fontSize={fontSize}
              />
            </View>
            <View style={styles.powerExponent}>
              <MathRenderer
                nodes={node.exponent}
                cursor={cursor}
                currentPath={[...nodePath, 1]}
                textColor={textColor}
                placeholderColor={placeholderColor}
                fontSize={fontSize * 0.65}
              />
            </View>
          </View>
        );
      
      case 'sqrt':
        return (
          <View key={index} style={styles.sqrt}>
            {node.index && (
              <View style={styles.sqrtIndex}>
                <MathRenderer
                  nodes={node.index}
                  cursor={cursor}
                  currentPath={[...nodePath, 0]}
                  textColor={textColor}
                  placeholderColor={placeholderColor}
                  fontSize={fontSize * 0.5}
                />
              </View>
            )}
            <Text style={[styles.sqrtSymbol, { color: textColor, fontSize }]}>√</Text>
            <View style={[styles.sqrtRadicand, { borderColor: textColor }]}>
              <MathRenderer
                nodes={node.radicand}
                cursor={cursor}
                currentPath={[...nodePath, 1]}
                textColor={textColor}
                placeholderColor={placeholderColor}
                fontSize={fontSize * 0.9}
              />
            </View>
          </View>
        );
      
      case 'parenthesis':
        return (
          <View key={index} style={styles.parenthesis}>
            <Text style={[styles.paren, { color: textColor, fontSize: fontSize * 1.2 }]}>(</Text>
            <MathRenderer
              nodes={node.content}
              cursor={cursor}
              currentPath={[...nodePath, 0]}
              textColor={textColor}
              placeholderColor={placeholderColor}
              fontSize={fontSize}
            />
            <Text style={[styles.paren, { color: textColor, fontSize: fontSize * 1.2 }]}>)</Text>
          </View>
        );
      
      case 'abs':
        return (
          <View key={index} style={styles.abs}>
            <Text style={[styles.absBar, { color: textColor, fontSize: fontSize * 1.2 }]}>|</Text>
            <MathRenderer
              nodes={node.content}
              cursor={cursor}
              currentPath={[...nodePath, 0]}
              textColor={textColor}
              placeholderColor={placeholderColor}
              fontSize={fontSize}
            />
            <Text style={[styles.absBar, { color: textColor, fontSize: fontSize * 1.2 }]}>|</Text>
          </View>
        );
      
      case 'trig':
        return (
          <View key={index} style={styles.trig}>
            <Text style={[styles.funcName, { color: textColor, fontSize: fontSize * 0.85 }]}>
              {node.func}
            </Text>
            <Text style={[styles.paren, { color: textColor, fontSize }]}>(</Text>
            <MathRenderer
              nodes={node.argument}
              cursor={cursor}
              currentPath={[...nodePath, 0]}
              textColor={textColor}
              placeholderColor={placeholderColor}
              fontSize={fontSize}
            />
            <Text style={[styles.paren, { color: textColor, fontSize }]}>)</Text>
          </View>
        );
      
      case 'log':
        return (
          <View key={index} style={styles.log}>
            <Text style={[styles.funcName, { color: textColor, fontSize: fontSize * 0.85 }]}>log</Text>
            {node.base && (
              <View style={styles.logBase}>
                <MathRenderer
                  nodes={node.base}
                  cursor={cursor}
                  currentPath={[...nodePath, 0]}
                  textColor={textColor}
                  placeholderColor={placeholderColor}
                  fontSize={fontSize * 0.55}
                />
              </View>
            )}
            <Text style={[styles.paren, { color: textColor, fontSize }]}>(</Text>
            <MathRenderer
              nodes={node.argument}
              cursor={cursor}
              currentPath={[...nodePath, node.base ? 1 : 0]}
              textColor={textColor}
              placeholderColor={placeholderColor}
              fontSize={fontSize}
            />
            <Text style={[styles.paren, { color: textColor, fontSize }]}>)</Text>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {isAtCursor(currentPath, 0) && renderCursor()}
      {nodes.map((node, index) => (
        <React.Fragment key={index}>
          {renderNode(node, index, currentPath)}
          {isAtCursor(currentPath, index + 1) && renderCursor()}
        </React.Fragment>
      ))}
      {nodes.length === 0 && isAtCursor(currentPath, 0) && renderCursor()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cursor: {
    width: 2,
    marginHorizontal: 1,
    borderRadius: 1,
  },
  number: {
    fontWeight: '400',
  },
  variable: {
    fontWeight: '500',
  },
  operator: {
    fontWeight: '400',
  },
  placeholder: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 2,
  },
  placeholderText: {
    opacity: 0.5,
  },
  fraction: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  fractionNumerator: {
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  fractionLine: {
    height: 1.5,
    minWidth: 30,
    alignSelf: 'stretch',
  },
  fractionDenominator: {
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  power: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  powerBase: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  powerExponent: {
    marginTop: -8,
    marginLeft: 1,
  },
  sqrt: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sqrtIndex: {
    marginRight: -4,
    marginBottom: 8,
  },
  sqrtSymbol: {
    fontWeight: '300',
  },
  sqrtRadicand: {
    borderTopWidth: 1.5,
    paddingHorizontal: 4,
    paddingTop: 2,
    marginLeft: -2,
  },
  parenthesis: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paren: {
    fontWeight: '300',
  },
  abs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  absBar: {
    fontWeight: '300',
  },
  trig: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  funcName: {
    fontWeight: '500',
    marginRight: 2,
  },
  log: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logBase: {
    marginTop: 8,
    marginRight: 1,
  },
});

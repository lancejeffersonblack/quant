import { useCallback, useState } from 'react';

export type MathNode =
  | { type: 'number'; value: string }
  | { type: 'variable'; name: string }
  | { type: 'operator'; op: string }
  | { type: 'fraction'; numerator: MathNode[]; denominator: MathNode[] }
  | { type: 'power'; base: MathNode[]; exponent: MathNode[] }
  | { type: 'sqrt'; index?: MathNode[]; radicand: MathNode[] }
  | { type: 'log'; base?: MathNode[]; argument: MathNode[] }
  | { type: 'abs'; content: MathNode[] }
  | { type: 'parenthesis'; content: MathNode[] }
  | { type: 'trig'; func: string; argument: MathNode[] }
  | { type: 'placeholder' };

export type CursorPosition = {
  path: number[];
  index: number;
};

export function useScientificCalculator() {
  const [expression, setExpression] = useState<MathNode[]>([]);
  const [cursor, setCursor] = useState<CursorPosition>({ path: [], index: 0 });
  const [history, setHistory] = useState<{ expr: MathNode[]; result: string }[]>([]);
  const [result, setResult] = useState<string>('0');
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG');

  const getNodesAtPath = useCallback((nodes: MathNode[], path: number[]): MathNode[] => {
    if (path.length === 0) return nodes;
    const node = nodes[path[0]];
    if (!node) return nodes;
    
    const remainingPath = path.slice(1);
    switch (node.type) {
      case 'fraction':
        if (remainingPath[0] === 0) return getNodesAtPath(node.numerator, remainingPath.slice(1));
        if (remainingPath[0] === 1) return getNodesAtPath(node.denominator, remainingPath.slice(1));
        break;
      case 'power':
        if (remainingPath[0] === 0) return getNodesAtPath(node.base, remainingPath.slice(1));
        if (remainingPath[0] === 1) return getNodesAtPath(node.exponent, remainingPath.slice(1));
        break;
      case 'sqrt':
        if (remainingPath[0] === 0 && node.index) return getNodesAtPath(node.index, remainingPath.slice(1));
        if (remainingPath[0] === 1) return getNodesAtPath(node.radicand, remainingPath.slice(1));
        break;
      case 'parenthesis':
      case 'abs':
        return getNodesAtPath(node.content, remainingPath.slice(1));
      case 'trig':
      case 'log':
        return getNodesAtPath(node.argument, remainingPath.slice(1));
    }
    return nodes;
  }, []);

  const setNodesAtPath = useCallback((nodes: MathNode[], path: number[], newNodes: MathNode[]): MathNode[] => {
    if (path.length === 0) return newNodes;
    
    return nodes.map((node, i) => {
      if (i !== path[0]) return node;
      
      const remainingPath = path.slice(1);
      if (remainingPath.length === 0) return node;
      
      switch (node.type) {
        case 'fraction':
          if (remainingPath[0] === 0) {
            return { ...node, numerator: setNodesAtPath(node.numerator, remainingPath.slice(1), newNodes) };
          }
          if (remainingPath[0] === 1) {
            return { ...node, denominator: setNodesAtPath(node.denominator, remainingPath.slice(1), newNodes) };
          }
          break;
        case 'power':
          if (remainingPath[0] === 0) {
            return { ...node, base: setNodesAtPath(node.base, remainingPath.slice(1), newNodes) };
          }
          if (remainingPath[0] === 1) {
            return { ...node, exponent: setNodesAtPath(node.exponent, remainingPath.slice(1), newNodes) };
          }
          break;
        case 'sqrt':
          if (remainingPath[0] === 0 && node.index) {
            return { ...node, index: setNodesAtPath(node.index, remainingPath.slice(1), newNodes) };
          }
          if (remainingPath[0] === 1) {
            return { ...node, radicand: setNodesAtPath(node.radicand, remainingPath.slice(1), newNodes) };
          }
          break;
        case 'parenthesis':
        case 'abs':
          return { ...node, content: setNodesAtPath(node.content, remainingPath.slice(1), newNodes) };
        case 'trig':
        case 'log':
          return { ...node, argument: setNodesAtPath(node.argument, remainingPath.slice(1), newNodes) };
      }
      return node;
    });
  }, []);

  const insertAtCursor = useCallback((newNode: MathNode) => {
    setExpression(prev => {
      const currentNodes = getNodesAtPath(prev, cursor.path);
      const updatedNodes = [
        ...currentNodes.slice(0, cursor.index),
        newNode,
        ...currentNodes.slice(cursor.index)
      ];
      
      if (cursor.path.length === 0) {
        return updatedNodes;
      }
      return setNodesAtPath(prev, cursor.path, updatedNodes);
    });
    setCursor(prev => ({ ...prev, index: prev.index + 1 }));
  }, [cursor, getNodesAtPath, setNodesAtPath]);

  const handleNumber = useCallback((num: string) => {
    const currentNodes = getNodesAtPath(expression, cursor.path);
    const prevNode = currentNodes[cursor.index - 1];
    
    if (prevNode?.type === 'number') {
      setExpression(prev => {
        const nodes = getNodesAtPath(prev, cursor.path);
        const updated = nodes.map((n, i) => 
          i === cursor.index - 1 && n.type === 'number' 
            ? { ...n, value: n.value + num }
            : n
        );
        if (cursor.path.length === 0) return updated;
        return setNodesAtPath(prev, cursor.path, updated);
      });
    } else {
      insertAtCursor({ type: 'number', value: num });
    }
  }, [expression, cursor, getNodesAtPath, insertAtCursor, setNodesAtPath]);

  const handleOperator = useCallback((op: string) => {
    insertAtCursor({ type: 'operator', op });
  }, [insertAtCursor]);

  const handleFraction = useCallback(() => {
    const newFraction: MathNode = {
      type: 'fraction',
      numerator: [{ type: 'placeholder' }],
      denominator: [{ type: 'placeholder' }]
    };
    insertAtCursor(newFraction);
    setCursor({ path: [...cursor.path, cursor.index, 0], index: 0 });
  }, [cursor, insertAtCursor]);

  const handlePower = useCallback(() => {
    const currentNodes = getNodesAtPath(expression, cursor.path);
    const prevNode = currentNodes[cursor.index - 1];
    
    if (prevNode && (prevNode.type === 'number' || prevNode.type === 'parenthesis')) {
      setExpression(prev => {
        const nodes = getNodesAtPath(prev, cursor.path);
        const base = nodes[cursor.index - 1];
        const newPower: MathNode = {
          type: 'power',
          base: [base],
          exponent: [{ type: 'placeholder' }]
        };
        const updated = [
          ...nodes.slice(0, cursor.index - 1),
          newPower,
          ...nodes.slice(cursor.index)
        ];
        if (cursor.path.length === 0) return updated;
        return setNodesAtPath(prev, cursor.path, updated);
      });
      setCursor({ path: [...cursor.path, cursor.index - 1, 1], index: 0 });
    } else {
      const newPower: MathNode = {
        type: 'power',
        base: [{ type: 'placeholder' }],
        exponent: [{ type: 'placeholder' }]
      };
      insertAtCursor(newPower);
      setCursor({ path: [...cursor.path, cursor.index, 0], index: 0 });
    }
  }, [expression, cursor, getNodesAtPath, setNodesAtPath, insertAtCursor]);

  const handleSquareRoot = useCallback(() => {
    const newSqrt: MathNode = {
      type: 'sqrt',
      radicand: [{ type: 'placeholder' }]
    };
    insertAtCursor(newSqrt);
    setCursor({ path: [...cursor.path, cursor.index, 1], index: 0 });
  }, [cursor, insertAtCursor]);

  const handleNthRoot = useCallback(() => {
    const newSqrt: MathNode = {
      type: 'sqrt',
      index: [{ type: 'placeholder' }],
      radicand: [{ type: 'placeholder' }]
    };
    insertAtCursor(newSqrt);
    setCursor({ path: [...cursor.path, cursor.index, 0], index: 0 });
  }, [cursor, insertAtCursor]);

  const handleTrig = useCallback((func: string) => {
    const newTrig: MathNode = {
      type: 'trig',
      func,
      argument: [{ type: 'placeholder' }]
    };
    insertAtCursor(newTrig);
    setCursor({ path: [...cursor.path, cursor.index, 0], index: 0 });
  }, [cursor, insertAtCursor]);

  const handleLog = useCallback((withBase: boolean = false) => {
    const newLog: MathNode = {
      type: 'log',
      base: withBase ? [{ type: 'placeholder' }] : undefined,
      argument: [{ type: 'placeholder' }]
    };
    insertAtCursor(newLog);
    const targetPath = withBase ? 0 : 0;
    setCursor({ path: [...cursor.path, cursor.index, targetPath], index: 0 });
  }, [cursor, insertAtCursor]);

  const handleParenthesis = useCallback(() => {
    const newParen: MathNode = {
      type: 'parenthesis',
      content: [{ type: 'placeholder' }]
    };
    insertAtCursor(newParen);
    setCursor({ path: [...cursor.path, cursor.index, 0], index: 0 });
  }, [cursor, insertAtCursor]);

  const handleAbs = useCallback(() => {
    const newAbs: MathNode = {
      type: 'abs',
      content: [{ type: 'placeholder' }]
    };
    insertAtCursor(newAbs);
    setCursor({ path: [...cursor.path, cursor.index, 0], index: 0 });
  }, [cursor, insertAtCursor]);

  const handleVariable = useCallback((name: string) => {
    insertAtCursor({ type: 'variable', name });
  }, [insertAtCursor]);

  const handleBackspace = useCallback(() => {
    if (cursor.index > 0) {
      setExpression(prev => {
        const nodes = getNodesAtPath(prev, cursor.path);
        const updated = [...nodes.slice(0, cursor.index - 1), ...nodes.slice(cursor.index)];
        if (cursor.path.length === 0) return updated;
        return setNodesAtPath(prev, cursor.path, updated);
      });
      setCursor(prev => ({ ...prev, index: prev.index - 1 }));
    } else if (cursor.path.length > 0) {
      setCursor({ path: cursor.path.slice(0, -2), index: cursor.path[cursor.path.length - 2] });
    }
  }, [cursor, getNodesAtPath, setNodesAtPath]);

  const handleClear = useCallback(() => {
    setExpression([]);
    setCursor({ path: [], index: 0 });
    setResult('0');
  }, []);

  const navigateRight = useCallback(() => {
    const currentNodes = getNodesAtPath(expression, cursor.path);
    if (cursor.index < currentNodes.length) {
      const nextNode = currentNodes[cursor.index];
      if (nextNode && hasChildren(nextNode)) {
        setCursor({ path: [...cursor.path, cursor.index, 0], index: 0 });
      } else {
        setCursor(prev => ({ ...prev, index: prev.index + 1 }));
      }
    } else if (cursor.path.length > 0) {
      setCursor({ path: cursor.path.slice(0, -2), index: cursor.path[cursor.path.length - 2] + 1 });
    }
  }, [expression, cursor, getNodesAtPath]);

  const navigateLeft = useCallback(() => {
    if (cursor.index > 0) {
      setCursor(prev => ({ ...prev, index: prev.index - 1 }));
    } else if (cursor.path.length > 0) {
      setCursor({ path: cursor.path.slice(0, -2), index: cursor.path[cursor.path.length - 2] });
    }
  }, [cursor]);

  const evaluateExpression = useCallback((nodes: MathNode[]): number => {
    const evaluateNode = (node: MathNode): number => {
      switch (node.type) {
        case 'number':
          return parseFloat(node.value);
        case 'placeholder':
          return 0;
        case 'operator':
          return NaN;
        case 'variable':
          return NaN;
        case 'fraction':
          return evaluateExpression(node.numerator) / evaluateExpression(node.denominator);
        case 'power':
          return Math.pow(evaluateExpression(node.base), evaluateExpression(node.exponent));
        case 'sqrt':
          if (node.index) {
            return Math.pow(evaluateExpression(node.radicand), 1 / evaluateExpression(node.index));
          }
          return Math.sqrt(evaluateExpression(node.radicand));
        case 'parenthesis':
          return evaluateExpression(node.content);
        case 'abs':
          return Math.abs(evaluateExpression(node.content));
        case 'trig': {
          const arg = evaluateExpression(node.argument);
          const radArg = angleMode === 'DEG' ? (arg * Math.PI) / 180 : arg;
          switch (node.func) {
            case 'sin': return Math.sin(radArg);
            case 'cos': return Math.cos(radArg);
            case 'tan': return Math.tan(radArg);
            case 'asin': return angleMode === 'DEG' ? Math.asin(arg) * 180 / Math.PI : Math.asin(arg);
            case 'acos': return angleMode === 'DEG' ? Math.acos(arg) * 180 / Math.PI : Math.acos(arg);
            case 'atan': return angleMode === 'DEG' ? Math.atan(arg) * 180 / Math.PI : Math.atan(arg);
            default: return NaN;
          }
        }
        case 'log':
          if (node.base) {
            return Math.log(evaluateExpression(node.argument)) / Math.log(evaluateExpression(node.base));
          }
          return Math.log10(evaluateExpression(node.argument));
        default:
          return NaN;
      }
    };

    const values: number[] = [];
    const operators: string[] = [];
    
    for (const node of nodes) {
      if (node.type === 'operator') {
        operators.push(node.op);
      } else {
        values.push(evaluateNode(node));
      }
    }
    
    // Handle multiplication/division first
    let i = 0;
    while (i < operators.length) {
      if (operators[i] === '×' || operators[i] === '÷') {
        const left = values[i];
        const right = values[i + 1];
        const result = operators[i] === '×' ? left * right : left / right;
        values.splice(i, 2, result);
        operators.splice(i, 1);
      } else {
        i++;
      }
    }
    
    // Handle addition/subtraction
    let result = values[0] || 0;
    for (let j = 0; j < operators.length; j++) {
      if (operators[j] === '+') {
        result += values[j + 1];
      } else if (operators[j] === '−') {
        result -= values[j + 1];
      }
    }
    
    return result;
  }, [angleMode]);

  const handleEquals = useCallback(() => {
    try {
      const evalResult = evaluateExpression(expression);
      if (!isNaN(evalResult) && isFinite(evalResult)) {
        const formatted = Number.isInteger(evalResult) 
          ? evalResult.toString() 
          : evalResult.toFixed(10).replace(/\.?0+$/, '');
        setResult(formatted);
        setHistory(prev => [...prev.slice(-4), { expr: [...expression], result: formatted }]);
      } else {
        setResult('Error');
      }
    } catch {
      setResult('Error');
    }
  }, [expression, evaluateExpression]);

  const toggleAngleMode = useCallback(() => {
    setAngleMode(prev => prev === 'DEG' ? 'RAD' : 'DEG');
  }, []);

  return {
    expression,
    cursor,
    result,
    history,
    angleMode,
    handleNumber,
    handleOperator,
    handleFraction,
    handlePower,
    handleSquareRoot,
    handleNthRoot,
    handleTrig,
    handleLog,
    handleParenthesis,
    handleAbs,
    handleVariable,
    handleBackspace,
    handleClear,
    handleEquals,
    navigateLeft,
    navigateRight,
    toggleAngleMode,
  };
}

function hasChildren(node: MathNode): boolean {
  return ['fraction', 'power', 'sqrt', 'parenthesis', 'abs', 'trig', 'log'].includes(node.type);
}

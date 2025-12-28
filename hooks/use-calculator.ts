import { useCalculatorStore } from '@/stores/calculator-store';
import { useCallback, useEffect, useState } from 'react';

export function useCalculator() {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string[]>([]);
  const [currentExpression, setCurrentExpression] = useState('');
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  
  const { pendingInsert, consumePendingInsert } = useCalculatorStore();

  // Handle pending insert from constants
  useEffect(() => {
    if (pendingInsert) {
      const value = consumePendingInsert();
      if (value) {
        if (shouldResetDisplay || display === '0') {
          setDisplay(value);
          setCurrentExpression(prev => prev === '' || prev === '0' ? value : prev + value);
        } else {
          setDisplay(prev => prev + value);
          setCurrentExpression(prev => prev + value);
        }
        setShouldResetDisplay(false);
      }
    }
  }, [pendingInsert, consumePendingInsert, shouldResetDisplay, display]);

  const formatNumber = (num: string): string => {
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const evaluateExpression = (expr: string): number => {
    try {
      // Replace display operators with JS operators
      let sanitized = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/%/g, '/100');
      
      // Handle square root
      sanitized = sanitized.replace(/√(\d+\.?\d*)/g, 'Math.sqrt($1)');
      
      // Evaluate using Function constructor (safer than eval)
      const result = new Function(`return ${sanitized}`)();
      return result;
    } catch {
      return NaN;
    }
  };

  const handleNumber = useCallback((num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setCurrentExpression(prev => prev + num);
      setShouldResetDisplay(false);
    } else {
      if (display === '0' && num !== '.') {
        setDisplay(num);
        setCurrentExpression(prev => (prev === '' || prev === '0' ? num : prev + num));
      } else if (num === '.' && display.includes('.')) {
        return;
      } else {
        setDisplay(prev => prev + num);
        setCurrentExpression(prev => prev + num);
      }
    }
  }, [display, shouldResetDisplay]);

  const handleOperator = useCallback((op: string) => {
    setShouldResetDisplay(true);
    setCurrentExpression(prev => prev + ` ${op} `);
  }, []);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setCurrentExpression('');
    setHistory([]);
    setShouldResetDisplay(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(prev => prev.slice(0, -1));
      setCurrentExpression(prev => prev.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display]);

  const handleEquals = useCallback(() => {
    if (!currentExpression) return;
    
    const result = evaluateExpression(currentExpression);
    if (!isNaN(result) && isFinite(result)) {
      const resultStr = Number.isInteger(result) ? result.toString() : result.toFixed(10).replace(/\.?0+$/, '');
      setHistory(prev => [...prev.slice(-3), currentExpression]);
      setDisplay(resultStr);
      setCurrentExpression(resultStr);
      setShouldResetDisplay(true);
    } else {
      setDisplay('Error');
      setShouldResetDisplay(true);
    }
  }, [currentExpression]);

  const handleParenthesis = useCallback((paren: string) => {
    setCurrentExpression(prev => prev + paren);
    setShouldResetDisplay(true);
  }, []);

  const handleSquareRoot = useCallback(() => {
    setCurrentExpression(prev => prev + '√');
    setShouldResetDisplay(true);
  }, []);

  const handlePercent = useCallback(() => {
    setCurrentExpression(prev => prev + '%');
    setShouldResetDisplay(true);
  }, []);

  const handlePlusMinus = useCallback(() => {
    if (display !== '0') {
      if (display.startsWith('-')) {
        setDisplay(prev => prev.slice(1));
      } else {
        setDisplay(prev => '-' + prev);
      }
    }
  }, [display]);

  return {
    display: formatNumber(display),
    history,
    currentExpression,
    handleNumber,
    handleOperator,
    handleClear,
    handleBackspace,
    handleEquals,
    handleParenthesis,
    handleSquareRoot,
    handlePercent,
    handlePlusMinus,
  };
}

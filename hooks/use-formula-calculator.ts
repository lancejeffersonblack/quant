import { useCallback, useState } from 'react';

export interface FormulaVariable {
  name: string;
  label: string;
  value: string;
  placeholder: string;
}

export interface Formula {
  id: string;
  name: string;
  description: string;
  variables: Omit<FormulaVariable, 'value'>[];
  calculate: (vars: Record<string, number>) => { result: string; steps?: string[] };
  displayFormula: string;
}

export const FORMULAS: Formula[] = [
  {
    id: 'quadratic',
    name: 'Quadratic',
    description: 'Solve ax² + bx + c = 0',
    displayFormula: 'x = (-b ± √(b²-4ac)) / 2a',
    variables: [
      { name: 'a', label: 'a', placeholder: 'coefficient a' },
      { name: 'b', label: 'b', placeholder: 'coefficient b' },
      { name: 'c', label: 'c', placeholder: 'coefficient c' },
    ],
    calculate: (vars) => {
      const { a, b, c } = vars;
      if (a === 0) return { result: 'Error: a cannot be 0' };
      const discriminant = b * b - 4 * a * c;
      if (discriminant < 0) {
        const real = -b / (2 * a);
        const imag = Math.sqrt(-discriminant) / (2 * a);
        return { 
          result: `x = ${real.toFixed(4)} ± ${imag.toFixed(4)}i`,
          steps: [`Discriminant = ${discriminant}`, 'Complex roots']
        };
      }
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      if (x1 === x2) {
        return { result: `x = ${x1.toFixed(4)}` };
      }
      return { result: `x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}` };
    },
  },
  {
    id: 'pythagorean',
    name: 'Pythagorean',
    description: 'a² + b² = c²',
    displayFormula: 'c = √(a² + b²)',
    variables: [
      { name: 'a', label: 'a', placeholder: 'side a' },
      { name: 'b', label: 'b', placeholder: 'side b' },
    ],
    calculate: (vars) => {
      const { a, b } = vars;
      const c = Math.sqrt(a * a + b * b);
      return { result: `c = ${c.toFixed(4)}` };
    },
  },
  {
    id: 'circle-area',
    name: 'Circle Area',
    description: 'Area of a circle',
    displayFormula: 'A = πr²',
    variables: [
      { name: 'r', label: 'r', placeholder: 'radius' },
    ],
    calculate: (vars) => {
      const area = Math.PI * vars.r * vars.r;
      return { result: `A = ${area.toFixed(4)}` };
    },
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest',
    description: 'A = P(1 + r/n)^(nt)',
    displayFormula: 'A = P(1 + r/n)^(nt)',
    variables: [
      { name: 'P', label: 'P', placeholder: 'principal' },
      { name: 'r', label: 'r', placeholder: 'rate (decimal)' },
      { name: 'n', label: 'n', placeholder: 'compounds/year' },
      { name: 't', label: 't', placeholder: 'years' },
    ],
    calculate: (vars) => {
      const { P, r, n, t } = vars;
      const A = P * Math.pow(1 + r / n, n * t);
      return { result: `A = ${A.toFixed(2)}` };
    },
  },
  {
    id: 'distance',
    name: 'Distance',
    description: 'Distance between two points',
    displayFormula: 'd = √((x₂-x₁)² + (y₂-y₁)²)',
    variables: [
      { name: 'x1', label: 'x₁', placeholder: 'x₁' },
      { name: 'y1', label: 'y₁', placeholder: 'y₁' },
      { name: 'x2', label: 'x₂', placeholder: 'x₂' },
      { name: 'y2', label: 'y₂', placeholder: 'y₂' },
    ],
    calculate: (vars) => {
      const dx = vars.x2 - vars.x1;
      const dy = vars.y2 - vars.y1;
      const d = Math.sqrt(dx * dx + dy * dy);
      return { result: `d = ${d.toFixed(4)}` };
    },
  },
  {
    id: 'slope',
    name: 'Slope',
    description: 'Slope of a line',
    displayFormula: 'm = (y₂ - y₁) / (x₂ - x₁)',
    variables: [
      { name: 'x1', label: 'x₁', placeholder: 'x₁' },
      { name: 'y1', label: 'y₁', placeholder: 'y₁' },
      { name: 'x2', label: 'x₂', placeholder: 'x₂' },
      { name: 'y2', label: 'y₂', placeholder: 'y₂' },
    ],
    calculate: (vars) => {
      const dx = vars.x2 - vars.x1;
      if (dx === 0) return { result: 'Undefined (vertical line)' };
      const m = (vars.y2 - vars.y1) / dx;
      return { result: `m = ${m.toFixed(4)}` };
    },
  },
];

export function useFormulaCalculator() {
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [variables, setVariables] = useState<FormulaVariable[]>([]);
  const [activeVariable, setActiveVariable] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');

  const selectFormula = useCallback((formula: Formula) => {
    setSelectedFormula(formula);
    setVariables(formula.variables.map(v => ({ ...v, value: '' })));
    setActiveVariable(formula.variables[0]?.name || null);
    setResult('');
  }, []);

  const clearFormula = useCallback(() => {
    setSelectedFormula(null);
    setVariables([]);
    setActiveVariable(null);
    setResult('');
  }, []);

  const setVariableValue = useCallback((name: string, value: string) => {
    setVariables(prev => prev.map(v => 
      v.name === name ? { ...v, value } : v
    ));
  }, []);

  const handleNumber = useCallback((num: string) => {
    if (!activeVariable) return;
    setVariables(prev => prev.map(v => {
      if (v.name !== activeVariable) return v;
      if (num === '.' && v.value.includes('.')) return v;
      return { ...v, value: v.value + num };
    }));
  }, [activeVariable]);

  const handleBackspace = useCallback(() => {
    if (!activeVariable) return;
    setVariables(prev => prev.map(v => 
      v.name === activeVariable ? { ...v, value: v.value.slice(0, -1) } : v
    ));
  }, [activeVariable]);

  const handleClear = useCallback(() => {
    if (!activeVariable) return;
    setVariables(prev => prev.map(v => 
      v.name === activeVariable ? { ...v, value: '' } : v
    ));
  }, [activeVariable]);

  const handlePlusMinus = useCallback(() => {
    if (!activeVariable) return;
    setVariables(prev => prev.map(v => {
      if (v.name !== activeVariable) return v;
      if (v.value.startsWith('-')) {
        return { ...v, value: v.value.slice(1) };
      }
      return { ...v, value: '-' + v.value };
    }));
  }, [activeVariable]);

  const calculate = useCallback(() => {
    if (!selectedFormula) return;
    
    const vars: Record<string, number> = {};
    for (const v of variables) {
      const num = parseFloat(v.value);
      if (isNaN(num)) {
        setResult(`Enter value for ${v.label}`);
        return;
      }
      vars[v.name] = num;
    }
    
    const { result: calcResult } = selectedFormula.calculate(vars);
    setResult(calcResult);
  }, [selectedFormula, variables]);

  const nextVariable = useCallback(() => {
    if (!variables.length) return;
    const currentIndex = variables.findIndex(v => v.name === activeVariable);
    const nextIndex = (currentIndex + 1) % variables.length;
    setActiveVariable(variables[nextIndex].name);
  }, [variables, activeVariable]);

  return {
    formulas: FORMULAS,
    selectedFormula,
    variables,
    activeVariable,
    result,
    selectFormula,
    clearFormula,
    setActiveVariable,
    setVariableValue,
    handleNumber,
    handleBackspace,
    handleClear,
    handlePlusMinus,
    calculate,
    nextVariable,
  };
}

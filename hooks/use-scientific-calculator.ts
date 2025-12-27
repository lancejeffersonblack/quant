import { useCallback, useState } from "react";

export type MathNode =
  | { type: "number"; value: string }
  | { type: "variable"; name: string }
  | { type: "operator"; op: string }
  | { type: "fraction"; numerator: MathNode[]; denominator: MathNode[] }
  | { type: "power"; base: MathNode[]; exponent: MathNode[] }
  | { type: "sqrt"; index?: MathNode[]; radicand: MathNode[] }
  | { type: "log"; base?: MathNode[]; argument: MathNode[] }
  | { type: "abs"; content: MathNode[] }
  | { type: "parenthesis"; content: MathNode[] }
  | { type: "trig"; func: string; argument: MathNode[] }
  | { type: "placeholder" };

export interface CursorPosition {
  path: number[];
  index: number;
}

// Pure helper functions (no hooks needed)
function getChildArray(node: MathNode, idx: number): MathNode[] | null {
  switch (node.type) {
    case "fraction":
      return idx === 0 ? node.numerator : idx === 1 ? node.denominator : null;
    case "power":
      return idx === 0 ? node.base : idx === 1 ? node.exponent : null;
    case "sqrt":
      return idx === 0 ? node.index || [] : idx === 1 ? node.radicand : null;
    case "parenthesis":
    case "abs":
      return idx === 0 ? node.content : null;
    case "trig":
      return idx === 0 ? node.argument : null;
    case "log":
      return idx === 0
        ? node.base || node.argument
        : idx === 1
        ? node.argument
        : null;
    default:
      return null;
  }
}

function getNodesAtPath(nodes: MathNode[], path: number[]): MathNode[] {
  if (path.length === 0) return nodes;
  const [nodeIndex, childIndex, ...rest] = path;
  const node = nodes[nodeIndex];
  if (!node) return nodes;
  const childArray = getChildArray(node, childIndex);
  if (!childArray) return nodes;
  return getNodesAtPath(childArray, rest);
}

function updateNodesAtPath(
  nodes: MathNode[],
  path: number[],
  updater: (arr: MathNode[]) => MathNode[]
): MathNode[] {
  if (path.length === 0) return updater(nodes);
  const [nodeIndex, childIndex, ...rest] = path;

  return nodes.map((node, i) => {
    if (i !== nodeIndex) return node;
    switch (node.type) {
      case "fraction":
        if (childIndex === 0)
          return {
            ...node,
            numerator: updateNodesAtPath(node.numerator, rest, updater),
          };
        if (childIndex === 1)
          return {
            ...node,
            denominator: updateNodesAtPath(node.denominator, rest, updater),
          };
        return node;
      case "power":
        if (childIndex === 0)
          return { ...node, base: updateNodesAtPath(node.base, rest, updater) };
        if (childIndex === 1)
          return {
            ...node,
            exponent: updateNodesAtPath(node.exponent, rest, updater),
          };
        return node;
      case "sqrt":
        if (childIndex === 0 && node.index)
          return {
            ...node,
            index: updateNodesAtPath(node.index, rest, updater),
          };
        if (childIndex === 1)
          return {
            ...node,
            radicand: updateNodesAtPath(node.radicand, rest, updater),
          };
        return node;
      case "parenthesis":
      case "abs":
        if (childIndex === 0)
          return {
            ...node,
            content: updateNodesAtPath(node.content, rest, updater),
          };
        return node;
      case "trig":
        if (childIndex === 0)
          return {
            ...node,
            argument: updateNodesAtPath(node.argument, rest, updater),
          };
        return node;
      case "log":
        if (childIndex === 0) {
          if (node.base)
            return {
              ...node,
              base: updateNodesAtPath(node.base, rest, updater),
            };
          return {
            ...node,
            argument: updateNodesAtPath(node.argument, rest, updater),
          };
        }
        if (childIndex === 1)
          return {
            ...node,
            argument: updateNodesAtPath(node.argument, rest, updater),
          };
        return node;
      default:
        return node;
    }
  });
}

function hasChildren(node: MathNode): boolean {
  return [
    "fraction",
    "power",
    "sqrt",
    "parenthesis",
    "abs",
    "trig",
    "log",
  ].includes(node.type);
}

function getFirstChildIndex(node: MathNode): number {
  if (node.type === "sqrt" && !("index" in node && node.index)) return 1;
  return 0;
}

function getNextChildIndex(
  node: MathNode,
  currentChild: number
): number | null {
  switch (node.type) {
    case "fraction":
    case "power":
      return currentChild === 0 ? 1 : null;
    case "sqrt":
      return node.index && currentChild === 0 ? 1 : null;
    case "log":
      return node.base && currentChild === 0 ? 1 : null;
    default:
      return null;
  }
}

export function useScientificCalculator() {
  const [expression, setExpression] = useState<MathNode[]>([]);
  const [cursor, setCursor] = useState<CursorPosition>({ path: [], index: 0 });
  const [history, setHistory] = useState<
    { expr: MathNode[]; result: string }[]
  >([]);
  const [result, setResult] = useState<string>("0");
  const [angleMode, setAngleMode] = useState<"DEG" | "RAD">("DEG");

  const handleNumber = useCallback(
    (num: string) => {
      setExpression((prev) => {
        const currentNodes = getNodesAtPath(prev, cursor.path);
        const prevNode = currentNodes[cursor.index - 1];

        if (prevNode?.type === "number") {
          return updateNodesAtPath(prev, cursor.path, (arr) =>
            arr.map((n, i) =>
              i === cursor.index - 1 && n.type === "number"
                ? { ...n, value: n.value + num }
                : n
            )
          );
        }

        return updateNodesAtPath(prev, cursor.path, (arr) => {
          const hasPlaceholder = arr[cursor.index]?.type === "placeholder";
          if (hasPlaceholder) {
            return [
              ...arr.slice(0, cursor.index),
              { type: "number", value: num },
              ...arr.slice(cursor.index + 1),
            ];
          }
          return [
            ...arr.slice(0, cursor.index),
            { type: "number", value: num },
            ...arr.slice(cursor.index),
          ];
        });
      });

      setCursor((prev) => {
        const currentNodes = getNodesAtPath(expression, prev.path);
        const prevNode = currentNodes[prev.index - 1];
        if (prevNode?.type === "number") return prev;
        return { ...prev, index: prev.index + 1 };
      });
    },
    [cursor, expression]
  );

  const handleOperator = useCallback(
    (op: string) => {
      setExpression((prev) =>
        updateNodesAtPath(prev, cursor.path, (arr) => [
          ...arr.slice(0, cursor.index),
          { type: "operator", op },
          ...arr.slice(cursor.index),
        ])
      );
      setCursor((prev) => ({ ...prev, index: prev.index + 1 }));
    },
    [cursor]
  );

  const handleFraction = useCallback(() => {
    const newFraction: MathNode = {
      type: "fraction",
      numerator: [{ type: "placeholder" }],
      denominator: [{ type: "placeholder" }],
    };
    setExpression((prev) =>
      updateNodesAtPath(prev, cursor.path, (arr) => {
        const hasPlaceholder = arr[cursor.index]?.type === "placeholder";
        if (hasPlaceholder)
          return [
            ...arr.slice(0, cursor.index),
            newFraction,
            ...arr.slice(cursor.index + 1),
          ];
        return [
          ...arr.slice(0, cursor.index),
          newFraction,
          ...arr.slice(cursor.index),
        ];
      })
    );
    setCursor({ path: [...cursor.path, cursor.index, 0], index: 0 });
  }, [cursor]);

  const handlePower = useCallback(() => {
    const currentNodes = getNodesAtPath(expression, cursor.path);
    const prevNode = currentNodes[cursor.index - 1];

    if (
      prevNode &&
      (prevNode.type === "number" ||
        prevNode.type === "parenthesis" ||
        prevNode.type === "variable")
    ) {
      setExpression((prev) =>
        updateNodesAtPath(prev, cursor.path, (arr) => {
          const base = arr[cursor.index - 1];
          const newPower: MathNode = {
            type: "power",
            base: [base],
            exponent: [{ type: "placeholder" }],
          };
          return [
            ...arr.slice(0, cursor.index - 1),
            newPower,
            ...arr.slice(cursor.index),
          ];
        })
      );
      setCursor({ path: [...cursor.path, cursor.index - 1, 1], index: 0 });
    } else {
      const newPower: MathNode = {
        type: "power",
        base: [{ type: "placeholder" }],
        exponent: [{ type: "placeholder" }],
      };
      setExpression((prev) =>
        updateNodesAtPath(prev, cursor.path, (arr) => [
          ...arr.slice(0, cursor.index),
          newPower,
          ...arr.slice(cursor.index),
        ])
      );
      setCursor({ path: [...cursor.path, cursor.index, 0], index: 0 });
    }
  }, [cursor, expression]);

  const handleSquareRoot = useCallback(() => {
    const newSqrt: MathNode = {
      type: "sqrt",
      radicand: [{ type: "placeholder" }],
    };
    setExpression((prev) =>
      updateNodesAtPath(prev, cursor.path, (arr) => [
        ...arr.slice(0, cursor.index),
        newSqrt,
        ...arr.slice(cursor.index),
      ])
    );
    setCursor({ path: [...cursor.path, cursor.index, 1], index: 0 });
  }, [cursor]);

  const handleNthRoot = useCallback(() => {
    const newSqrt: MathNode = {
      type: "sqrt",
      index: [{ type: "placeholder" }],
      radicand: [{ type: "placeholder" }],
    };
    setExpression((prev) =>
      updateNodesAtPath(prev, cursor.path, (arr) => [
        ...arr.slice(0, cursor.index),
        newSqrt,
        ...arr.slice(cursor.index),
      ])
    );
    setCursor({ path: [...cursor.path, cursor.index, 0], index: 0 });
  }, [cursor]);

  const handleTrig = useCallback(
    (func: string) => {
      const newTrig: MathNode = {
        type: "trig",
        func,
        argument: [{ type: "placeholder" }],
      };
      setExpression((prev) =>
        updateNodesAtPath(prev, cursor.path, (arr) => [
          ...arr.slice(0, cursor.index),
          newTrig,
          ...arr.slice(cursor.index),
        ])
      );
      setCursor({ path: [...cursor.path, cursor.index, 0], index: 0 });
    },
    [cursor]
  );

  const handleLog = useCallback(
    (withBase: boolean = false) => {
      const newLog: MathNode = {
        type: "log",
        base: withBase ? [{ type: "placeholder" }] : undefined,
        argument: [{ type: "placeholder" }],
      };
      setExpression((prev) =>
        updateNodesAtPath(prev, cursor.path, (arr) => [
          ...arr.slice(0, cursor.index),
          newLog,
          ...arr.slice(cursor.index),
        ])
      );
      setCursor({ path: [...cursor.path, cursor.index, 0], index: 0 });
    },
    [cursor]
  );

  const handleParenthesis = useCallback(() => {
    const newParen: MathNode = {
      type: "parenthesis",
      content: [{ type: "placeholder" }],
    };
    setExpression((prev) =>
      updateNodesAtPath(prev, cursor.path, (arr) => [
        ...arr.slice(0, cursor.index),
        newParen,
        ...arr.slice(cursor.index),
      ])
    );
    setCursor({ path: [...cursor.path, cursor.index, 0], index: 0 });
  }, [cursor]);

  const handleAbs = useCallback(() => {
    const newAbs: MathNode = {
      type: "abs",
      content: [{ type: "placeholder" }],
    };
    setExpression((prev) =>
      updateNodesAtPath(prev, cursor.path, (arr) => [
        ...arr.slice(0, cursor.index),
        newAbs,
        ...arr.slice(cursor.index),
      ])
    );
    setCursor({ path: [...cursor.path, cursor.index, 0], index: 0 });
  }, [cursor]);

  const handleVariable = useCallback(
    (name: string) => {
      setExpression((prev) =>
        updateNodesAtPath(prev, cursor.path, (arr) => [
          ...arr.slice(0, cursor.index),
          { type: "variable", name },
          ...arr.slice(cursor.index),
        ])
      );
      setCursor((prev) => ({ ...prev, index: prev.index + 1 }));
    },
    [cursor]
  );

  const handleBackspace = useCallback(() => {
    if (cursor.index > 0) {
      setExpression((prev) =>
        updateNodesAtPath(prev, cursor.path, (arr) => [
          ...arr.slice(0, cursor.index - 1),
          ...arr.slice(cursor.index),
        ])
      );
      setCursor((prev) => ({ ...prev, index: prev.index - 1 }));
    } else if (cursor.path.length >= 2) {
      const parentPath = cursor.path.slice(0, -2);
      const parentIndex = cursor.path[cursor.path.length - 2];
      setCursor({ path: parentPath, index: parentIndex });
    }
  }, [cursor]);

  const handleClear = useCallback(() => {
    setExpression([]);
    setCursor({ path: [], index: 0 });
    setResult("0");
  }, []);

  const navigateRight = useCallback(() => {
    const currentNodes = getNodesAtPath(expression, cursor.path);

    if (cursor.index < currentNodes.length) {
      const node = currentNodes[cursor.index];
      if (node && hasChildren(node)) {
        const firstChildIndex = getFirstChildIndex(node);
        setCursor({
          path: [...cursor.path, cursor.index, firstChildIndex],
          index: 0,
        });
        return;
      }
      setCursor((prev) => ({ ...prev, index: prev.index + 1 }));
    } else if (cursor.path.length >= 2) {
      const parentPath = cursor.path.slice(0, -2);
      const nodeIndex = cursor.path[cursor.path.length - 2];
      const childIndex = cursor.path[cursor.path.length - 1];
      const parentNodes = getNodesAtPath(expression, parentPath);
      const parentNode = parentNodes[nodeIndex];
      const nextChildIndex = getNextChildIndex(parentNode, childIndex);
      if (nextChildIndex !== null) {
        setCursor({
          path: [...parentPath, nodeIndex, nextChildIndex],
          index: 0,
        });
      } else {
        setCursor({ path: parentPath, index: nodeIndex + 1 });
      }
    }
  }, [expression, cursor]);

  const navigateLeft = useCallback(() => {
    if (cursor.index > 0) {
      setCursor((prev) => ({ ...prev, index: prev.index - 1 }));
    } else if (cursor.path.length >= 2) {
      const parentPath = cursor.path.slice(0, -2);
      const nodeIndex = cursor.path[cursor.path.length - 2];
      setCursor({ path: parentPath, index: nodeIndex });
    }
  }, [cursor]);

  const evaluateExpression = useCallback(
    (nodes: MathNode[]): number => {
      const evaluateNode = (node: MathNode): number => {
        switch (node.type) {
          case "number":
            return parseFloat(node.value);
          case "placeholder":
            return 0;
          case "operator":
            return NaN;
          case "variable":
            return NaN;
          case "fraction":
            return (
              evaluateExpression(node.numerator) /
              evaluateExpression(node.denominator)
            );
          case "power":
            return Math.pow(
              evaluateExpression(node.base),
              evaluateExpression(node.exponent)
            );
          case "sqrt":
            return node.index
              ? Math.pow(
                  evaluateExpression(node.radicand),
                  1 / evaluateExpression(node.index)
                )
              : Math.sqrt(evaluateExpression(node.radicand));
          case "parenthesis":
            return evaluateExpression(node.content);
          case "abs":
            return Math.abs(evaluateExpression(node.content));
          case "trig": {
            const arg = evaluateExpression(node.argument);
            const radArg = angleMode === "DEG" ? (arg * Math.PI) / 180 : arg;
            switch (node.func) {
              case "sin":
                return Math.sin(radArg);
              case "cos":
                return Math.cos(radArg);
              case "tan":
                return Math.tan(radArg);
              case "asin":
                return angleMode === "DEG"
                  ? (Math.asin(arg) * 180) / Math.PI
                  : Math.asin(arg);
              case "acos":
                return angleMode === "DEG"
                  ? (Math.acos(arg) * 180) / Math.PI
                  : Math.acos(arg);
              case "atan":
                return angleMode === "DEG"
                  ? (Math.atan(arg) * 180) / Math.PI
                  : Math.atan(arg);
              default:
                return NaN;
            }
          }
          case "log":
            return node.base
              ? Math.log(evaluateExpression(node.argument)) /
                  Math.log(evaluateExpression(node.base))
              : Math.log10(evaluateExpression(node.argument));
          default:
            return NaN;
        }
      };

      const values: number[] = [];
      const operators: string[] = [];
      for (const node of nodes) {
        if (node.type === "operator") operators.push(node.op);
        else if (node.type !== "placeholder") values.push(evaluateNode(node));
      }
      if (values.length === 0) return 0;

      let i = 0;
      while (i < operators.length) {
        if (operators[i] === "×" || operators[i] === "÷") {
          const res =
            operators[i] === "×"
              ? values[i] * values[i + 1]
              : values[i] / values[i + 1];
          values.splice(i, 2, res);
          operators.splice(i, 1);
        } else i++;
      }

      let res = values[0] || 0;
      for (let j = 0; j < operators.length; j++) {
        if (operators[j] === "+") res += values[j + 1];
        else if (operators[j] === "−") res -= values[j + 1];
      }
      return res;
    },
    [angleMode]
  );

  const handleEquals = useCallback(() => {
    try {
      const evalResult = evaluateExpression(expression);
      if (!isNaN(evalResult) && isFinite(evalResult)) {
        const formatted = Number.isInteger(evalResult)
          ? evalResult.toString()
          : evalResult.toFixed(10).replace(/\.?0+$/, "");
        setResult(formatted);
        setHistory((prev) => [
          ...prev.slice(-4),
          { expr: [...expression], result: formatted },
        ]);
      } else {
        setResult("Error");
      }
    } catch {
      setResult("Error");
    }
  }, [expression, evaluateExpression]);

  const toggleAngleMode = useCallback(() => {
    setAngleMode((prev) => (prev === "DEG" ? "RAD" : "DEG"));
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

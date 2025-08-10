import React, { useState } from "react";
import './app.css';

const OPERATORS = ["+", "-", "*", "/"];

function Calculator() {
  const [input, setInput] = useState("0"); // display string
  const [evaluated, setEvaluated] = useState(false); // track if last action was evaluation

  // Utility to safely evaluate the expression string
  const evaluateExpression = (expr) => {
    try {
      // Replace any trailing operator
      let safeExpr = expr;
      while (
        safeExpr.length > 0 &&
        OPERATORS.includes(safeExpr[safeExpr.length - 1])
      ) {
        safeExpr = safeExpr.slice(0, -1);
      }
      // Evaluate with built-in eval but safer:
      // Limit precision and fix decimals
      // Use Function constructor instead of eval for slightly better safety
      const result = Function(`"use strict"; return (${safeExpr})`)();
      if (isNaN(result) || !isFinite(result)) return "Error";
      return parseFloat(result.toFixed(10)).toString();
    } catch {
      return "Error";
    }
  };

  // Helper: get last number part to check decimal or leading zero
  const getLastNumber = (str) => {
    const match = str.match(/(\d+\.?\d*)$/);
    return match ? match[0] : "";
  };

  const handleClear = () => {
    setInput("0");
    setEvaluated(false);
  };

  const handleNumber = (num) => {
    if (evaluated) {
      // After evaluation, starting a new number resets input
      setInput(num);
      setEvaluated(false);
      return;
    }
    if (input === "0") {
      // Replace leading zero unless decimal
      setInput(num);
      return;
    }

    // Prevent multiple leading zeros in a number
    const lastNumber = getLastNumber(input);
    if (lastNumber === "0") {
      // If last number is a single 0 and next digit is number, replace it
      if (!input.endsWith(".")) {
        setInput(input.slice(0, -1) + num);
        return;
      }
    }
    setInput(input + num);
  };

  const handleDecimal = () => {
    if (evaluated) {
      // Start new number with 0.
      setInput("0.");
      setEvaluated(false);
      return;
    }
    const lastNumber = getLastNumber(input);
    if (lastNumber.includes(".")) return; // already has decimal

    if (
      input === "" ||
      OPERATORS.includes(input[input.length - 1]) // if last char is operator
    ) {
      // start new number with 0.
      setInput(input + "0.");
    } else {
      setInput(input + ".");
    }
  };

  const handleOperator = (op) => {
    if (input === "Error") return;
    if (evaluated) {
      // After evaluation, operator starts new calculation with previous result
      setInput(input + op);
      setEvaluated(false);
      return;
    }

    const lastChar = input[input.length - 1];
    if (OPERATORS.includes(lastChar)) {
      // Handle consecutive operators per rules:
      // The last operator replaces previous except minus can be negative sign
      if (op === "-" && lastChar !== "-") {
        // allow minus after operator as negative sign
        setInput(input + op);
      } else {
        // Replace last operator(s) with new operator
        // Remove trailing operators first
        let newInput = input;
        while (
          newInput.length > 0 &&
          OPERATORS.includes(newInput[newInput.length - 1])
        ) {
          newInput = newInput.slice(0, -1);
        }
        setInput(newInput + op);
      }
    } else {
      setInput(input + op);
    }
  };

  const handleEquals = () => {
    if (input === "Error") return;
    const result = evaluateExpression(input);
    setInput(result);
    setEvaluated(true);
  };

  return (
    <div
      style={{
        width: "320px",
        margin: "40px auto",
        padding: "20px",
        borderRadius: "10px",
        background: "#222",
        color: "#eee",
        fontFamily: "Arial, sans-serif",
        boxShadow: "0 0 15px #0ff",
      }}
    >
      <div
        id="display"
        style={{
          background: "#111",
          padding: "20px",
          fontSize: "2rem",
          textAlign: "right",
          borderRadius: "5px",
          marginBottom: "10px",
          overflowWrap: "break-word",
          minHeight: "50px",
        }}
      >
        {input}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {/* Clear */}
        <button
          id="clear"
          onClick={handleClear}
          style={{
            gridColumn: "span 2",
            padding: "15px",
            fontSize: "1.2rem",
            background: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          AC
        </button>

        {/* Divide */}
        <button
          id="divide"
          onClick={() => handleOperator("/")}
          style={{
            background: "#03a9f4",
            color: "white",
            fontSize: "1.5rem",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ÷
        </button>

        {/* Multiply */}
        <button
          id="multiply"
          onClick={() => handleOperator("*")}
          style={{
            background: "#03a9f4",
            color: "white",
            fontSize: "1.5rem",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        {/* Numbers and operators */}
        {[7, 8, 9].map((num) => (
          <button
            key={num}
            id={["seven", "eight", "nine"][num - 7]}
            onClick={() => handleNumber(num.toString())}
            style={{
              padding: "15px",
              fontSize: "1.5rem",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              background: "#444",
              color: "white",
            }}
          >
            {num}
          </button>
        ))}

        {/* Subtract */}
        <button
          id="subtract"
          onClick={() => handleOperator("-")}
          style={{
            background: "#03a9f4",
            color: "white",
            fontSize: "1.5rem",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          −
        </button>

        {[4, 5, 6].map((num) => (
          <button
            key={num}
            id={["four", "five", "six"][num - 4]}
            onClick={() => handleNumber(num.toString())}
            style={{
              padding: "15px",
              fontSize: "1.5rem",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              background: "#444",
              color: "white",
            }}
          >
            {num}
          </button>
        ))}

        {/* Add */}
        <button
          id="add"
          onClick={() => handleOperator("+")}
          style={{
            background: "#03a9f4",
            color: "white",
            fontSize: "1.5rem",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            gridRow: "span 2",
          }}
        >
          +
        </button>

        {[1, 2, 3].map((num) => (
          <button
            key={num}
            id={["one", "two", "three"][num - 1]}
            onClick={() => handleNumber(num.toString())}
            style={{
              padding: "15px",
              fontSize: "1.5rem",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              background: "#444",
              color: "white",
            }}
          >
            {num}
          </button>
        ))}

        {/* Zero */}
        <button
          id="zero"
          onClick={() => handleNumber("0")}
          style={{
            gridColumn: "span 2",
            padding: "15px",
            fontSize: "1.5rem",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            background: "#444",
            color: "white",
          }}
        >
          0
        </button>

        {/* Decimal */}
        <button
          id="decimal"
          onClick={handleDecimal}
          style={{
            padding: "15px",
            fontSize: "1.5rem",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            background: "#444",
            color: "white",
          }}
        >
          .
        </button>

        {/* Equals */}
        <button
          id="equals"
          onClick={handleEquals}
          style={{
            background: "#4caf50",
            color: "white",
            fontSize: "1.5rem",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          =
        </button>
      </div>
    </div>
  );
}

export default Calculator;

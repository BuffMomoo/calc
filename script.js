const expressionDisplay = document.querySelector("#expression");
const resultDisplay = document.querySelector("#result");
const keys = document.querySelector(".keys");

let expression = "";
let justCalculated = false;

const operators = ["+", "-", "*", "/", "%"];

function formatExpression(value) {
  return value.replaceAll("*", "x") || "0";
}

function updateDisplay(result = null) {
  expressionDisplay.textContent = formatExpression(expression);
  resultDisplay.textContent = result ?? formatExpression(expression);
}

function appendValue(value) {
  if (justCalculated && !operators.includes(value)) {
    expression = "";
  }

  justCalculated = false;
  const last = expression.slice(-1);

  if (value === "." && currentNumber().includes(".")) {
    return;
  }

  if (operators.includes(value)) {
    if (!expression && value !== "-") {
      return;
    }

    if (operators.includes(last)) {
      expression = expression.slice(0, -1);
    }
  }

  expression += value;
  updateDisplay();
}

function currentNumber() {
  return expression.split(/[+\-*/%]/).pop() || "";
}

function clearCalculator() {
  expression = "";
  justCalculated = false;
  updateDisplay("0");
}

function deleteLast() {
  expression = expression.slice(0, -1);
  justCalculated = false;
  updateDisplay(expression ? null : "0");
}

function calculate() {
  if (!expression) {
    return;
  }

  const safeExpression = expression.replace(/%/g, "/100");

  if (!/^[\d+\-*/.()\s]+$/.test(safeExpression) || /[+\-*/.]$/.test(safeExpression)) {
    resultDisplay.textContent = "Error";
    return;
  }

  try {
    const value = Function(`"use strict"; return (${safeExpression})`)();

    if (!Number.isFinite(value)) {
      resultDisplay.textContent = "Error";
      return;
    }

    const rounded = Number.parseFloat(value.toFixed(10)).toString();
    resultDisplay.textContent = rounded;
    expressionDisplay.textContent = formatExpression(expression);
    expression = rounded;
    justCalculated = true;
  } catch {
    resultDisplay.textContent = "Error";
  }
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  if (button.dataset.value) {
    appendValue(button.dataset.value);
    return;
  }

  if (button.dataset.action === "clear") {
    clearCalculator();
  }

  if (button.dataset.action === "delete") {
    deleteLast();
  }

  if (button.dataset.action === "calculate") {
    calculate();
  }
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^\d$/.test(key) || operators.includes(key) || key === ".") {
    appendValue(key);
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
  }

  if (key === "Backspace") {
    deleteLast();
  }

  if (key === "Escape") {
    clearCalculator();
  }
});

updateDisplay("0");

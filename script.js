class Calculator {
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.clear();
    }

    // Resets all internal state variables
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }

    // Appends a number or decimal point
    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = number;
            this.shouldResetScreen = false;
            this.updateDisplay();
            return;
        }

        // Prevent multiple decimals
        if (number === '.' && this.currentOperand.includes('.')) return;

        // Replace '0' only if a non-decimal digit is pressed
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand + number;
        }

        this.updateDisplay();
    }

    // Sets the operator and initiates a calculation if previous numbers exist
    chooseOperation(operation) {
        if (this.currentOperand === '') return;

        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.shouldResetScreen = true;
    }

    // Performs the calculation
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert("Error: Division by zero!");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Fix floating point errors and limit to 7 decimal places
        this.currentOperand = parseFloat(computation.toFixed(7)).toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    // Updates the calculator display input field
    updateDisplay() {
        this.displayElement.value = this.currentOperand;
    }
}

// 1. Get references to HTML elements
const displayElement = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

// 2. Initialize the Calculator object
const calculator = new Calculator(displayElement);

// 3. Attach event listeners to all buttons
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.dataset.type;
        const value = button.textContent;
        const operatorValue = button.dataset.value;

        switch (type) {
            case 'number':
                calculator.appendNumber(value);
                break;
            case 'decimal':
                calculator.appendNumber('.');
                break;
            case 'operator':
                if (value === 'C') {
                    calculator.clear();
                } else {
                    calculator.chooseOperation(operatorValue);
                }
                break;
            case 'equals':
                calculator.compute();
                break;
        }
    });
});

/**
 * Scientific Calculator - JavaScript functionality
 * Performs advanced mathematical calculations including trigonometric functions, logarithms, exponents, and more.
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const expressionDisplay = document.getElementById('expression-display');
    const resultDisplay = document.getElementById('result-display');
    const angleMode = document.getElementById('angle-mode');
    const decimalPlaces = document.getElementById('decimal-places');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    
    // Calculator state
    let currentExpression = '';
    let currentResult = 0;
    let lastAnswer = 0;
    let memoryValue = 0;
    let isNewCalculation = true;
    
    // Settings
    let settings = {
        angleMode: 'deg', // 'deg' or 'rad'
        decimalPlaces: 2
    };
    
    // History
    let calculationHistory = [];
    
    // Initialize the calculator
    function initCalculator() {
        // Load saved settings if available
        loadSettings();
        
        // Load saved history if available
        loadHistory();
        
        // Set up event listeners
        setupEventListeners();
        
        // Apply settings
        applySettings();
        
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'scientific-calculator');
            }
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Number buttons
        const numberButtons = document.querySelectorAll('.number-btn');
        numberButtons.forEach(button => {
            button.addEventListener('click', function() {
                handleNumberInput(this.textContent);
            });
        });
        
        // Operator buttons
        const operatorButtons = document.querySelectorAll('.operator-btn');
        operatorButtons.forEach(button => {
            button.addEventListener('click', function() {
                handleOperatorInput(this.textContent);
            });
        });
        
        // Function buttons
        const functionButtons = document.querySelectorAll('.function-btn');
        functionButtons.forEach(button => {
            button.addEventListener('click', function() {
                handleFunctionInput(this.textContent);
            });
        });
        
        // Constant buttons
        const constantButtons = document.querySelectorAll('.constant-btn');
        constantButtons.forEach(button => {
            button.addEventListener('click', function() {
                handleConstantInput(this.textContent);
            });
        });
        
        // Memory buttons
        const memoryButtons = document.querySelectorAll('.memory-btn');
        memoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                handleMemoryOperation(this.textContent);
            });
        });
        
        // Clear buttons
        const clearButtons = document.querySelectorAll('.clear-btn');
        clearButtons.forEach(button => {
            button.addEventListener('click', function() {
                handleClearOperation(this.textContent);
            });
        });
        
        // Equals button
        const equalsButtons = document.querySelectorAll('.equals-btn');
        equalsButtons.forEach(button => {
            button.addEventListener('click', function() {
                calculateResult();
            });
        });
        
        // Settings changes
        angleMode.addEventListener('change', function() {
            settings.angleMode = this.value;
            saveSettings();
        });
        
        decimalPlaces.addEventListener('change', function() {
            settings.decimalPlaces = parseInt(this.value);
            saveSettings();
            updateDisplay();
        });
        
        // Clear history button
        clearHistoryBtn.addEventListener('click', function() {
            clearHistory();
        });
        
        // Keyboard support
        document.addEventListener('keydown', handleKeyboardInput);
        
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
    
    // Handle number input
    function handleNumberInput(value) {
        if (isNewCalculation) {
            currentExpression = '';
            isNewCalculation = false;
        }
        
        // Handle decimal point
        if (value === '.' && currentExpression.includes('.')) {
            // Check if there's already a decimal point in the current number
            const parts = currentExpression.split(/[\+\-\×\÷\(]/);
            const lastPart = parts[parts.length - 1];
            if (lastPart.includes('.')) {
                return;
            }
        }
        
        currentExpression += value;
        updateDisplay();
    }
    
    // Handle operator input
    function handleOperatorInput(operator) {
        if (currentExpression === '' && operator !== '-') {
            // Allow negative numbers
            return;
        }
        
        // Convert operators for calculation
        let calculationOperator;
        switch (operator) {
            case '×':
                calculationOperator = '*';
                break;
            case '÷':
                calculationOperator = '/';
                break;
            case '%':
                calculationOperator = '%';
                break;
            case 'mod':
                calculationOperator = '%';
                break;
            default:
                calculationOperator = operator;
        }
        
        // Handle consecutive operators
        const lastChar = currentExpression.slice(-1);
        if (['+', '-', '×', '÷', '%'].includes(lastChar)) {
            // Replace the last operator
            currentExpression = currentExpression.slice(0, -1) + operator;
        } else {
            currentExpression += operator;
        }
        
        isNewCalculation = false;
        updateDisplay();
    }
    
    // Handle function input
    function handleFunctionInput(func) {
        if (isNewCalculation && func !== '(' && func !== ')' && func !== 'DEL' && func !== 'Ans' && func !== '±') {
            currentExpression = '';
            isNewCalculation = false;
        }
        
        switch (func) {
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'ln':
                currentExpression += func + '(';
                break;
            case '√':
                currentExpression += 'sqrt(';
                break;
            case 'x²':
                if (currentExpression !== '') {
                    // Try to evaluate the current expression first
                    try {
                        const value = evaluateExpression(currentExpression);
                        currentExpression = value + '^2';
                    } catch (e) {
                        currentExpression += '^2';
                    }
                }
                break;
            case 'x^y':
                currentExpression += '^';
                break;
            case 'e^x':
                currentExpression += 'exp(';
                break;
            case '(':
            case ')':
                currentExpression += func;
                break;
            case 'DEL':
                if (currentExpression.length > 0) {
                    currentExpression = currentExpression.slice(0, -1);
                }
                break;
            case 'Ans':
                currentExpression += lastAnswer;
                break;
            case '±':
                if (currentExpression === '') {
                    currentExpression = '-';
                } else {
                    // Try to negate the last number
                    const match = currentExpression.match(/([\d\.]+)$/);
                    if (match) {
                        const lastNumber = match[0];
                        const position = currentExpression.lastIndexOf(lastNumber);
                        const isNegative = position > 0 && currentExpression[position - 1] === '-';
                        
                        if (isNegative && currentExpression[position - 2] === '(' && position >= 2) {
                            // Remove the negative sign inside parentheses
                            currentExpression = currentExpression.substring(0, position - 1) + 
                                               currentExpression.substring(position);
                        } else if (isNegative && position > 0) {
                            // Remove the negative sign
                            currentExpression = currentExpression.substring(0, position - 1) + 
                                               currentExpression.substring(position);
                        } else {
                            // Add a negative sign
                            currentExpression = currentExpression.substring(0, position) + 
                                               '-' + currentExpression.substring(position);
                        }
                    }
                }
                break;
        }
        
        updateDisplay();
    }
    
    // Handle constant input
    function handleConstantInput(constant) {
        if (isNewCalculation) {
            currentExpression = '';
            isNewCalculation = false;
        }
        
        switch (constant) {
            case 'π':
                currentExpression += 'PI';
                break;
            case 'e':
                currentExpression += 'E';
                break;
        }
        
        updateDisplay();
    }
    
    // Handle memory operations
    function handleMemoryOperation(operation) {
        switch (operation) {
            case 'MC':
                memoryValue = 0;
                break;
            case 'MR':
                if (memoryValue !== 0) {
                    if (isNewCalculation) {
                        currentExpression = '';
                        isNewCalculation = false;
                    }
                    currentExpression += memoryValue;
                    updateDisplay();
                }
                break;
            case 'M+':
                try {
                    const value = evaluateExpression(currentExpression);
                    memoryValue += value;
                    isNewCalculation = true;
                } catch (e) {
                    // Handle error
                }
                break;
            case 'M-':
                try {
                    const value = evaluateExpression(currentExpression);
                    memoryValue -= value;
                    isNewCalculation = true;
                } catch (e) {
                    // Handle error
                }
                break;
        }
    }
    
    // Handle clear operations
    function handleClearOperation(operation) {
        switch (operation) {
            case 'AC':
                // All Clear
                currentExpression = '';
                currentResult = 0;
                resultDisplay.textContent = '0';
                expressionDisplay.textContent = '';
                break;
            case 'C':
                // Clear current entry
                currentExpression = '';
                resultDisplay.textContent = '0';
                expressionDisplay.textContent = '';
                break;
        }
    }
    
    // Handle keyboard input
    function handleKeyboardInput(e) {
        const key = e.key;
        
        // Numbers and decimal point
        if (/[0-9\.]/.test(key)) {
            handleNumberInput(key);
            return;
        }
        
        // Operators
        if (['+', '-', '*', '/', '%'].includes(key)) {
            let operator = key;
            if (key === '*') operator = '×';
            if (key === '/') operator = '÷';
            handleOperatorInput(operator);
            return;
        }
        
        // Parentheses
        if (key === '(' || key === ')') {
            handleFunctionInput(key);
            return;
        }
        
        // Calculate result
        if (key === 'Enter' || key === '=') {
            calculateResult();
            return;
        }
        
        // Backspace
        if (key === 'Backspace') {
            handleFunctionInput('DEL');
            return;
        }
        
        // Clear
        if (key === 'Escape') {
            handleClearOperation('AC');
            return;
        }
    }
    
    // Calculate the result
    function calculateResult() {
        if (currentExpression === '') {
            return;
        }
        
        try {
            // Evaluate the expression
            const result = evaluateExpression(currentExpression);
            
            // Format the result
            currentResult = result;
            lastAnswer = result;
            
            // Add to history
            addToHistory(currentExpression, result);
            
            // Update display
            expressionDisplay.textContent = formatExpression(currentExpression) + ' =';
            resultDisplay.textContent = formatResult(result);
            
            // Prepare for next calculation
            currentExpression = result.toString();
            isNewCalculation = true;
            
        } catch (error) {
            // Handle calculation error
            resultDisplay.textContent = 'Error';
            expressionDisplay.textContent = formatExpression(currentExpression);
        }
    }
    
    // Evaluate mathematical expression
    function evaluateExpression(expr) {
        // Replace mathematical constants and functions
        let expression = expr
            .replace(/PI/g, Math.PI)
            .replace(/E/g, Math.E)
            .replace(/\^/g, '**') // Exponentiation
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/mod/g, '%')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/exp\(/g, 'Math.exp(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(');
        
        // Handle trigonometric functions based on angle mode
        if (settings.angleMode === 'deg') {
            // Convert degrees to radians for calculations
            expression = expression
                .replace(/sin\(/g, 'Math.sin(degreesToRadians(')
                .replace(/cos\(/g, 'Math.cos(degreesToRadians(')
                .replace(/tan\(/g, 'Math.tan(degreesToRadians(')
                .replace(/\)\)/g, '))');
        } else {
            expression = expression
                .replace(/sin\(/g, 'Math.sin(')
                .replace(/cos\(/g, 'Math.cos(')
                .replace(/tan\(/g, 'Math.tan(');
        }
        
        // Define helper function for degrees to radians conversion
        function degreesToRadians(degrees) {
            return degrees * (Math.PI / 180);
        }
        
        // Evaluate the expression
        return eval(expression);
    }
    
    // Format expression for display
    function formatExpression(expr) {
        return expr
            .replace(/PI/g, 'π')
            .replace(/E/g, 'e')
            .replace(/\*/g, '×')
            .replace(/\//g, '÷')
            .replace(/sqrt\(/g, '√(')
            .replace(/\*\*/g, '^');
    }
    
    // Format result with appropriate decimal places
    function formatResult(result) {
        if (isNaN(result) || !isFinite(result)) {
            return 'Error';
        }
        
        // Check if result is an integer
        if (Number.isInteger(result)) {
            return result.toString();
        }
        
        return result.toFixed(settings.decimalPlaces);
    }
    
    // Update the calculator display
    function updateDisplay() {
        expressionDisplay.textContent = formatExpression(currentExpression);
        
        // Try to evaluate the expression as you type
        if (currentExpression !== '') {
            try {
                const result = evaluateExpression(currentExpression);
                resultDisplay.textContent = formatResult(result);
            } catch (e) {
                // If evaluation fails, just show the expression
                resultDisplay.textContent = formatExpression(currentExpression) || '0';
            }
        } else {
            resultDisplay.textContent = '0';
        }
    }
    
    // Add calculation to history
    function addToHistory(expression, result) {
        // Create history item
        const historyItem = {
            expression: expression,
            result: result,
            timestamp: new Date().getTime()
        };
        
        // Add to history array
        calculationHistory.unshift(historyItem);
        
        // Limit history to 10 items
        if (calculationHistory.length > 10) {
            calculationHistory.pop();
        }
        
        // Save history
        saveHistory();
        
        // Update history display
        updateHistoryDisplay();
    }
    
    // Update history display
    function updateHistoryDisplay() {
        // Clear current history display
        historyList.innerHTML = '';
        
        if (calculationHistory.length === 0) {
            historyList.innerHTML = '<div class="text-gray-500 italic">No calculations yet</div>';
            return;
        }
        
        // Add each history item
        calculationHistory.forEach(item => {
            const historyItemElement = document.createElement('div');
            historyItemElement.className = 'flex justify-between hover:bg-gray-100 p-1 rounded';
            historyItemElement.innerHTML = `
                <span>${formatExpression(item.expression)} =</span>
                <span class="font-medium">${formatResult(item.result)}</span>
            `;
            
            // Add click event to reuse the calculation
            historyItemElement.addEventListener('click', function() {
                currentExpression = item.result.toString();
                updateDisplay();
                isNewCalculation = false;
            });
            
            historyList.appendChild(historyItemElement);
        });
    }
    
    // Clear history
    function clearHistory() {
        calculationHistory = [];
        saveHistory();
        updateHistoryDisplay();
    }
    
    // Apply settings to UI
    function applySettings() {
        angleMode.value = settings.angleMode;
        decimalPlaces.value = settings.decimalPlaces;
    }
    
    // Save settings to localStorage
    function saveSettings() {
        localStorage.setItem('scientificCalculatorSettings', JSON.stringify(settings));
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('scientificCalculatorSettings');
        if (savedSettings) {
            settings = {...settings, ...JSON.parse(savedSettings)};
        }
    }
    
    // Save history to localStorage
    function saveHistory() {
        localStorage.setItem('scientificCalculatorHistory', JSON.stringify(calculationHistory));
    }
    
    // Load history from localStorage
    function loadHistory() {
        const savedHistory = localStorage.getItem('scientificCalculatorHistory');
        if (savedHistory) {
            calculationHistory = JSON.parse(savedHistory);
            updateHistoryDisplay();
        }
    }
    
    // Initialize the calculator
    initCalculator();
});

// Add 3D icon definition for the Scientific Calculator
if (typeof Tool3DIcon !== 'undefined') {
    Tool3DIcon.addIconDefinition('scientific-calculator', function(scene, container) {
        // Create a Scientific Calculator 3D model
        const group = new THREE.Group();
        
        // Base platform
        const baseGeometry = new THREE.BoxGeometry(2, 0.2, 2);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x3B82F6, // Blue color
            metalness: 0.3,
            roughness: 0.7
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.5;
        group.add(base);
        
        // Calculator body
        const bodyGeometry = new THREE.BoxGeometry(1.8, 0.3, 1.8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x1F2937, // Dark gray
            metalness: 0.2,
            roughness: 0.8
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = -0.25;
        group.add(body);
        
        // Calculator screen
        const screenGeometry = new THREE.BoxGeometry(1.6, 0.05, 0.8);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0xE5E7EB, // Light gray
            metalness: 0.1,
            roughness: 0.5,
            emissive: 0x10B981, // Green glow
            emissiveIntensity: 0.2
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.y = -0.05;
        screen.position.z = 0.4;
        group.add(screen);
        
        // Create calculator buttons
        const createButton = (x, z, color) => {
            const buttonGeometry = new THREE.BoxGeometry(0.25, 0.05, 0.25);
            const buttonMaterial = new THREE.MeshStandardMaterial({
                color: color,
                metalness: 0.2,
                roughness: 0.7
            });
            const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
            button.position.set(x, 0, z);
            return button;
        };
        
        // Add buttons in a grid pattern
        const buttonColors = [
            0x3B82F6, // Blue - function buttons
            0x10B981, // Green - number buttons
            0xF59E0B, // Yellow - operator buttons
            0xEF4444  // Red - clear button
        ];
        
        // Create button grid
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const x = -0.6 + col * 0.4;
                const z = -0.2 - row * 0.4;
                
                // Determine button color based on position
                let colorIndex;
                if (row === 0) colorIndex = 0; // Function buttons on top row
                else if (col === 3) colorIndex = 2; // Operator buttons on right column
                else if (row === 3 && col === 0) colorIndex = 3; // Clear button
                else colorIndex = 1; // Number buttons
                
                const button = createButton(x, z, buttonColors[colorIndex]);
                group.add(button);
            }
        }
        
        // Animation
        const animate = () => {
            // Floating animation
            gsap.to(group.position, {
                y: 0.2,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            
            // Screen glow animation
            gsap.to(screenMaterial, {
                emissiveIntensity: 0.5,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            
            // Subtle rotation
            gsap.to(group.rotation, {
                y: Math.PI * 2,
                duration: 15,
                repeat: -1,
                ease: "none"
            });
        };
        
        animate();
        
        return group;
    });
}
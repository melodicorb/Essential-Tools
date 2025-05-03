/**
 * Area Calculator - JavaScript functionality
 * Calculates the area of various geometric shapes with precision.
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const shapeSelect = document.getElementById('shape-select');
    const shapeForms = document.querySelectorAll('.shape-form');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result-container');
    const resultValue = document.getElementById('result-value');
    const resultFormula = document.getElementById('result-formula');
    const copyResultBtn = document.getElementById('copy-result-btn');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const autoCalculateCheckbox = document.getElementById('auto-calculate');
    const decimalPlacesSelect = document.getElementById('decimal-places');
    const outputUnitSelect = document.getElementById('output-unit');
    
    // All input fields
    const allInputFields = document.querySelectorAll('input[type="number"]');
    const allUnitSelects = document.querySelectorAll('select[id$="-unit"]');
    
    // Settings
    let settings = {
        autoCalculate: true,
        decimalPlaces: 2,
        outputUnit: 'm²'
    };
    
    // History
    let calculationHistory = [];
    
    // Constants
    const PI = Math.PI;
    
    // Unit conversion factors (to square meters)
    const unitConversions = {
        // Length units to meters
        'm': 1,
        'cm': 0.01,
        'mm': 0.001,
        'in': 0.0254,
        'ft': 0.3048,
        'yd': 0.9144,
        
        // Area units from square meters
        'm²': 1,
        'cm²': 10000,
        'mm²': 1000000,
        'in²': 1550.0031,
        'ft²': 10.7639,
        'yd²': 1.19599,
        'ac': 0.000247105,
        'ha': 0.0001
    };
    
    // Initialize the area calculator
    function initAreaCalculator() {
        // Load saved settings if available
        loadSettings();
        
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
                Tool3DIcon.init(container, 'area-calculator');
            }
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Shape selection change
        shapeSelect.addEventListener('change', function() {
            showSelectedShapeForm();
            if (settings.autoCalculate) {
                calculate();
            }
        });
        
        // Calculate button click
        calculateBtn.addEventListener('click', function() {
            calculate();
        });
        
        // Auto-calculate input changes
        allInputFields.forEach(input => {
            input.addEventListener('input', function() {
                if (settings.autoCalculate) {
                    calculate();
                }
            });
        });
        
        // Unit changes
        allUnitSelects.forEach(select => {
            select.addEventListener('change', function() {
                if (settings.autoCalculate) {
                    calculate();
                }
            });
        });
        
        // Settings changes
        autoCalculateCheckbox.addEventListener('change', function() {
            settings.autoCalculate = this.checked;
            saveSettings();
        });
        
        decimalPlacesSelect.addEventListener('change', function() {
            settings.decimalPlaces = parseInt(this.value);
            saveSettings();
            if (resultContainer.classList.contains('hidden') === false) {
                calculate(); // Recalculate to apply new decimal places
            }
        });
        
        outputUnitSelect.addEventListener('change', function() {
            settings.outputUnit = this.value;
            saveSettings();
            if (resultContainer.classList.contains('hidden') === false) {
                calculate(); // Recalculate to apply new output unit
            }
        });
        
        // Copy result button
        copyResultBtn.addEventListener('click', function() {
            copyResultToClipboard();
        });
        
        // Clear history button
        clearHistoryBtn.addEventListener('click', function() {
            clearHistory();
        });
        
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
    
    // Show the selected shape form
    function showSelectedShapeForm() {
        const selectedShape = shapeSelect.value;
        
        // Hide all shape forms
        shapeForms.forEach(form => {
            form.classList.add('hidden');
        });
        
        // Show the selected shape form
        const selectedForm = document.getElementById(`${selectedShape}-form`);
        if (selectedForm) {
            selectedForm.classList.remove('hidden');
        }
    }
    
    // Calculate the area based on the selected shape
    function calculate() {
        const selectedShape = shapeSelect.value;
        let area = 0;
        let formula = '';
        let dimensions = {};
        
        // Get dimensions and calculate area based on the selected shape
        switch (selectedShape) {
            case 'rectangle':
                dimensions = {
                    length: getValueInMeters('rectangle-length', 'rectangle-length-unit'),
                    width: getValueInMeters('rectangle-width', 'rectangle-width-unit')
                };
                
                area = dimensions.length * dimensions.width;
                formula = `Area = Length × Width = ${formatNumber(dimensions.length)} m × ${formatNumber(dimensions.width)} m = ${formatNumber(area)} m²`;
                break;
                
            case 'square':
                dimensions = {
                    side: getValueInMeters('square-side', 'square-side-unit')
                };
                
                area = dimensions.side * dimensions.side;
                formula = `Area = Side² = ${formatNumber(dimensions.side)} m × ${formatNumber(dimensions.side)} m = ${formatNumber(area)} m²`;
                break;
                
            case 'circle':
                dimensions = {
                    radius: getValueInMeters('circle-radius', 'circle-radius-unit')
                };
                
                area = PI * dimensions.radius * dimensions.radius;
                formula = `Area = π × r² = π × ${formatNumber(dimensions.radius)}² m = ${formatNumber(area)} m²`;
                break;
                
            case 'triangle':
                dimensions = {
                    base: getValueInMeters('triangle-base', 'triangle-base-unit'),
                    height: getValueInMeters('triangle-height', 'triangle-height-unit')
                };
                
                area = 0.5 * dimensions.base * dimensions.height;
                formula = `Area = ½ × Base × Height = ½ × ${formatNumber(dimensions.base)} m × ${formatNumber(dimensions.height)} m = ${formatNumber(area)} m²`;
                break;
                
            case 'trapezoid':
                dimensions = {
                    a: getValueInMeters('trapezoid-a', 'trapezoid-a-unit'),
                    b: getValueInMeters('trapezoid-b', 'trapezoid-b-unit'),
                    height: getValueInMeters('trapezoid-height', 'trapezoid-height-unit')
                };
                
                area = 0.5 * (dimensions.a + dimensions.b) * dimensions.height;
                formula = `Area = ½ × (a + b) × h = ½ × (${formatNumber(dimensions.a)} m + ${formatNumber(dimensions.b)} m) × ${formatNumber(dimensions.height)} m = ${formatNumber(area)} m²`;
                break;
                
            case 'ellipse':
                dimensions = {
                    a: getValueInMeters('ellipse-a', 'ellipse-a-unit'),
                    b: getValueInMeters('ellipse-b', 'ellipse-b-unit')
                };
                
                area = PI * dimensions.a * dimensions.b;
                formula = `Area = π × a × b = π × ${formatNumber(dimensions.a)} m × ${formatNumber(dimensions.b)} m = ${formatNumber(area)} m²`;
                break;
                
            case 'parallelogram':
                dimensions = {
                    base: getValueInMeters('parallelogram-base', 'parallelogram-base-unit'),
                    height: getValueInMeters('parallelogram-height', 'parallelogram-height-unit')
                };
                
                area = dimensions.base * dimensions.height;
                formula = `Area = Base × Height = ${formatNumber(dimensions.base)} m × ${formatNumber(dimensions.height)} m = ${formatNumber(area)} m²`;
                break;
        }
        
        // Convert area to the selected output unit
        const convertedArea = convertArea(area, settings.outputUnit);
        
        // Display the result
        displayResult(convertedArea, formula);
        
        // Add to history
        addToHistory(selectedShape, dimensions, convertedArea);
        
        return convertedArea;
    }
    
    // Get value in meters from input field and unit select
    function getValueInMeters(inputId, unitSelectId) {
        const input = document.getElementById(inputId);
        const unitSelect = document.getElementById(unitSelectId);
        
        if (!input || !unitSelect) return 0;
        
        const value = parseFloat(input.value) || 0;
        const unit = unitSelect.value;
        
        // Convert to meters
        return value * unitConversions[unit];
    }
    
    // Convert area from square meters to the selected output unit
    function convertArea(areaInSquareMeters, outputUnit) {
        return areaInSquareMeters * unitConversions[outputUnit];
    }
    
    // Format number with the specified decimal places
    function formatNumber(number) {
        return number.toFixed(settings.decimalPlaces);
    }
    
    // Display the calculation result
    function displayResult(area, formula) {
        resultValue.textContent = `${formatNumber(area)} ${settings.outputUnit}`;
        resultFormula.textContent = formula;
        resultContainer.classList.remove('hidden');
    }
    
    // Copy result to clipboard
    function copyResultToClipboard() {
        const textToCopy = resultValue.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(function() {
            // Show a temporary 'Copied!' message
            const originalText = copyResultBtn.textContent;
            copyResultBtn.textContent = 'Copied!';
            
            setTimeout(function() {
                copyResultBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy`;
            }, 1500);
        });
    }
    
    // Add calculation to history
    function addToHistory(shape, dimensions, area) {
        // Create history item
        const historyItem = {
            shape: shape,
            dimensions: dimensions,
            area: area,
            outputUnit: settings.outputUnit,
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
        
        // If no history, show message
        if (calculationHistory.length === 0) {
            historyList.innerHTML = '<div class="text-gray-500 italic">No calculations yet</div>';
            return;
        }
        
        // Add history items to display
        calculationHistory.forEach((item, index) => {
            const historyItemEl = document.createElement('div');
            historyItemEl.className = 'py-1 border-b border-gray-100 last:border-0';
            
            let dimensionsText = '';
            switch (item.shape) {
                case 'rectangle':
                    dimensionsText = `${formatNumber(item.dimensions.length)} × ${formatNumber(item.dimensions.width)} m`;
                    break;
                case 'square':
                    dimensionsText = `${formatNumber(item.dimensions.side)} m side`;
                    break;
                case 'circle':
                    dimensionsText = `${formatNumber(item.dimensions.radius)} m radius`;
                    break;
                case 'triangle':
                    dimensionsText = `base: ${formatNumber(item.dimensions.base)} m, height: ${formatNumber(item.dimensions.height)} m`;
                    break;
                case 'trapezoid':
                    dimensionsText = `a: ${formatNumber(item.dimensions.a)} m, b: ${formatNumber(item.dimensions.b)} m, h: ${formatNumber(item.dimensions.height)} m`;
                    break;
                case 'ellipse':
                    dimensionsText = `a: ${formatNumber(item.dimensions.a)} m, b: ${formatNumber(item.dimensions.b)} m`;
                    break;
                case 'parallelogram':
                    dimensionsText = `base: ${formatNumber(item.dimensions.base)} m, height: ${formatNumber(item.dimensions.height)} m`;
                    break;
            }
            
            historyItemEl.innerHTML = `
                <div class="flex justify-between">
                    <span class="font-medium capitalize">${item.shape}</span>
                    <span>${formatNumber(item.area)} ${item.outputUnit}</span>
                </div>
                <div class="text-xs text-gray-500">${dimensionsText}</div>
            `;
            
            historyList.appendChild(historyItemEl);
        });
    }
    
    // Clear calculation history
    function clearHistory() {
        calculationHistory = [];
        saveHistory();
        updateHistoryDisplay();
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('areaCalculatorSettings');
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                settings = { ...settings, ...parsedSettings };
            } catch (e) {
                console.error('Error parsing saved settings:', e);
            }
        }
    }
    
    // Save settings to localStorage
    function saveSettings() {
        localStorage.setItem('areaCalculatorSettings', JSON.stringify(settings));
    }
    
    // Apply settings to UI
    function applySettings() {
        autoCalculateCheckbox.checked = settings.autoCalculate;
        decimalPlacesSelect.value = settings.decimalPlaces;
        outputUnitSelect.value = settings.outputUnit;
    }
    
    // Load history from localStorage
    function loadHistory() {
        const savedHistory = localStorage.getItem('areaCalculatorHistory');
        if (savedHistory) {
            try {
                calculationHistory = JSON.parse(savedHistory);
                updateHistoryDisplay();
            } catch (e) {
                console.error('Error parsing saved history:', e);
            }
        }
    }
    
    // Save history to localStorage
    function saveHistory() {
        localStorage.setItem('areaCalculatorHistory', JSON.stringify(calculationHistory));
    }
    
    // Initialize the calculator
    initAreaCalculator();
});
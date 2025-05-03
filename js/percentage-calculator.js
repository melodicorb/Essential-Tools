/**
 * Percentage Calculator - JavaScript functionality
 * Calculates various percentage operations: percentage of a number, percentage change, etc.
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const calculationTypeSelect = document.getElementById('calculation-type');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDisplay = document.getElementById('result-display');
    const resultText = document.getElementById('result-text');
    const autoCalculateCheckbox = document.getElementById('auto-calculate');
    const decimalPlacesSelect = document.getElementById('decimal-places');
    
    // Form elements
    const calculationForms = document.querySelectorAll('.calculation-form');
    
    // Percentage of a number form
    const percentageValue = document.getElementById('percentage-value');
    const ofValue = document.getElementById('of-value');
    
    // Percentage change form
    const fromValue = document.getElementById('from-value');
    const toValue = document.getElementById('to-value');
    
    // What percentage form
    const partValue = document.getElementById('part-value');
    const wholeValue = document.getElementById('whole-value');
    
    // Increase by percentage form
    const increaseValue = document.getElementById('increase-value');
    const increasePercentage = document.getElementById('increase-percentage');
    
    // Decrease by percentage form
    const decreaseValue = document.getElementById('decrease-value');
    const decreasePercentage = document.getElementById('decrease-percentage');
    
    // Settings
    let settings = {
        autoCalculate: true,
        decimalPlaces: 2
    };
    
    // Initialize the percentage calculator
    function initPercentageCalculator() {
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
                Tool3DIcon.init(container, 'percentage-calculator');
            }
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Calculation type change
        calculationTypeSelect.addEventListener('change', function() {
            showSelectedForm();
            clearResult();
        });
        
        // Calculate button click
        calculateBtn.addEventListener('click', function() {
            calculate();
        });
        
        // Auto-calculate input changes
        const allInputs = document.querySelectorAll('input[type="number"]');
        allInputs.forEach(input => {
            input.addEventListener('input', function() {
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
            if (resultDisplay.classList.contains('hidden') === false) {
                calculate(); // Recalculate to apply new decimal places
            }
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
    
    // Show the selected calculation form
    function showSelectedForm() {
        const selectedForm = calculationTypeSelect.value;
        
        // Hide all forms first
        calculationForms.forEach(form => {
            form.classList.add('hidden');
        });
        
        // Show the selected form
        document.getElementById(`${selectedForm}-form`).classList.remove('hidden');
    }
    
    // Perform the calculation based on the selected type
    function calculate() {
        const calculationType = calculationTypeSelect.value;
        let result = 0;
        let resultMessage = '';
        
        switch(calculationType) {
            case 'percentage-of':
                if (percentageValue.value && ofValue.value) {
                    const percentage = parseFloat(percentageValue.value);
                    const number = parseFloat(ofValue.value);
                    result = (percentage / 100) * number;
                    resultMessage = `${percentage}% of ${number} = ${result.toFixed(settings.decimalPlaces)}`;
                }
                break;
                
            case 'percentage-change':
                if (fromValue.value && toValue.value) {
                    const from = parseFloat(fromValue.value);
                    const to = parseFloat(toValue.value);
                    if (from === 0) {
                        resultMessage = 'Cannot calculate percentage change from zero';
                    } else {
                        result = ((to - from) / Math.abs(from)) * 100;
                        const changeType = result >= 0 ? 'increase' : 'decrease';
                        resultMessage = `Percentage ${changeType}: ${Math.abs(result).toFixed(settings.decimalPlaces)}%`;
                    }
                }
                break;
                
            case 'what-percentage':
                if (partValue.value && wholeValue.value) {
                    const part = parseFloat(partValue.value);
                    const whole = parseFloat(wholeValue.value);
                    if (whole === 0) {
                        resultMessage = 'Cannot divide by zero';
                    } else {
                        result = (part / whole) * 100;
                        resultMessage = `${part} is ${result.toFixed(settings.decimalPlaces)}% of ${whole}`;
                    }
                }
                break;
                
            case 'increase-by-percentage':
                if (increaseValue.value && increasePercentage.value) {
                    const value = parseFloat(increaseValue.value);
                    const percentage = parseFloat(increasePercentage.value);
                    result = value * (1 + percentage / 100);
                    resultMessage = `${value} increased by ${percentage}% = ${result.toFixed(settings.decimalPlaces)}`;
                }
                break;
                
            case 'decrease-by-percentage':
                if (decreaseValue.value && decreasePercentage.value) {
                    const value = parseFloat(decreaseValue.value);
                    const percentage = parseFloat(decreasePercentage.value);
                    result = value * (1 - percentage / 100);
                    resultMessage = `${value} decreased by ${percentage}% = ${result.toFixed(settings.decimalPlaces)}`;
                }
                break;
        }
        
        // Display the result
        if (resultMessage) {
            resultText.textContent = resultMessage;
            resultDisplay.classList.remove('hidden');
        } else {
            clearResult();
        }
    }
    
    // Clear the result display
    function clearResult() {
        resultText.textContent = '';
        resultDisplay.classList.add('hidden');
    }
    
    // Apply settings to UI
    function applySettings() {
        autoCalculateCheckbox.checked = settings.autoCalculate;
        decimalPlacesSelect.value = settings.decimalPlaces;
    }
    
    // Save settings to localStorage
    function saveSettings() {
        localStorage.setItem('percentageCalculatorSettings', JSON.stringify(settings));
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('percentageCalculatorSettings');
        if (savedSettings) {
            settings = {...settings, ...JSON.parse(savedSettings)};
        }
    }
    
    // Initialize the percentage calculator
    initPercentageCalculator();
});

// Add 3D icon definition for the Percentage Calculator
if (typeof Tool3DIcon !== 'undefined') {
    Tool3DIcon.addIconDefinition('percentage-calculator', function(scene, container) {
        // Create a Percentage Calculator 3D model
        const group = new THREE.Group();
        
        // Base platform
        const baseGeometry = new THREE.BoxGeometry(2, 0.2, 2);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x10B981, // Green color
            metalness: 0.2,
            roughness: 0.8
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.5;
        group.add(base);
        
        // Create percentage symbol
        const createPercentageSymbol = () => {
            const symbolGroup = new THREE.Group();
            
            // First circle (top-left)
            const circle1 = new THREE.Mesh(
                new THREE.CircleGeometry(0.3, 32),
                new THREE.MeshStandardMaterial({ 
                    color: 0x3B82F6, // Blue
                    metalness: 0.3,
                    roughness: 0.7
                })
            );
            circle1.position.set(-0.4, 0.4, 0.1);
            symbolGroup.add(circle1);
            
            // Second circle (bottom-right)
            const circle2 = new THREE.Mesh(
                new THREE.CircleGeometry(0.3, 32),
                new THREE.MeshStandardMaterial({ 
                    color: 0x3B82F6, // Blue
                    metalness: 0.3,
                    roughness: 0.7
                })
            );
            circle2.position.set(0.4, -0.4, 0.1);
            symbolGroup.add(circle2);
            
            // Diagonal line
            const lineGeometry = new THREE.BoxGeometry(1.4, 0.1, 0.05);
            const lineMaterial = new THREE.MeshStandardMaterial({
                color: 0x8B5CF6, // Purple
                metalness: 0.5,
                roughness: 0.5
            });
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.position.z = 0.05;
            line.rotation.z = Math.PI / 4; // 45 degrees
            symbolGroup.add(line);
            
            return symbolGroup;
        };
        
        const percentageSymbol = createPercentageSymbol();
        percentageSymbol.position.y = 0.2;
        group.add(percentageSymbol);
        
        // Animation
        const animate = () => {
            gsap.to(percentageSymbol.rotation, {
                y: Math.PI * 2,
                duration: 8,
                repeat: -1,
                ease: "none"
            });
            
            gsap.to(percentageSymbol.position, {
                y: 0.4,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        };
        
        animate();
        
        return group;
    });
}
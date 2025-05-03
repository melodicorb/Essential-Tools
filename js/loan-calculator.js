/**
 * Loan Calculator - JavaScript functionality
 * Calculates loan payments, total interest, and generates amortization schedules.
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loanTypeSelect = document.getElementById('loan-type');
    const loanAmountInput = document.getElementById('loan-amount');
    const interestRateInput = document.getElementById('interest-rate');
    const loanTermInput = document.getElementById('loan-term');
    const termUnitSelect = document.getElementById('term-unit');
    const paymentFrequencySelect = document.getElementById('payment-frequency');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDisplay = document.getElementById('result-display');
    const monthlyPaymentDisplay = document.getElementById('monthly-payment');
    const totalPaymentDisplay = document.getElementById('total-payment');
    const totalInterestDisplay = document.getElementById('total-interest');
    const numberOfPaymentsDisplay = document.getElementById('number-of-payments');
    const toggleScheduleBtn = document.getElementById('toggle-schedule');
    const toggleText = document.getElementById('toggle-text');
    const toggleIcon = document.getElementById('toggle-icon');
    const amortizationSchedule = document.getElementById('amortization-schedule');
    const amortizationTableBody = document.getElementById('amortization-table-body');
    const autoCalculateCheckbox = document.getElementById('auto-calculate');
    const decimalPlacesSelect = document.getElementById('decimal-places');
    
    // Settings
    let settings = {
        autoCalculate: true,
        decimalPlaces: 2
    };
    
    // Initialize the loan calculator
    function initLoanCalculator() {
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
                Tool3DIcon.init(container, 'loan-calculator');
            }
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Loan type change
        loanTypeSelect.addEventListener('change', function() {
            setDefaultValues(this.value);
            if (settings.autoCalculate) {
                calculate();
            }
        });
        
        // Input changes
        const inputElements = [loanAmountInput, interestRateInput, loanTermInput];
        inputElements.forEach(input => {
            input.addEventListener('input', function() {
                if (settings.autoCalculate) {
                    calculate();
                }
            });
        });
        
        // Select changes
        const selectElements = [termUnitSelect, paymentFrequencySelect];
        selectElements.forEach(select => {
            select.addEventListener('change', function() {
                if (settings.autoCalculate) {
                    calculate();
                }
            });
        });
        
        // Calculate button click
        calculateBtn.addEventListener('click', function() {
            calculate();
        });
        
        // Toggle amortization schedule
        toggleScheduleBtn.addEventListener('click', function() {
            amortizationSchedule.classList.toggle('hidden');
            if (amortizationSchedule.classList.contains('hidden')) {
                toggleText.textContent = 'Show Amortization Schedule';
                toggleIcon.innerHTML = '<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />';
            } else {
                toggleText.textContent = 'Hide Amortization Schedule';
                toggleIcon.innerHTML = '<path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />';
            }
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
    }
    
    // Set default values based on loan type
    function setDefaultValues(loanType) {
        switch(loanType) {
            case 'mortgage':
                // Default values for mortgage loans
                if (!loanAmountInput.value) loanAmountInput.value = '250000';
                if (!interestRateInput.value) interestRateInput.value = '4.5';
                if (!loanTermInput.value) loanTermInput.value = '30';
                termUnitSelect.value = 'years';
                break;
                
            case 'auto':
                // Default values for auto loans
                if (!loanAmountInput.value) loanAmountInput.value = '25000';
                if (!interestRateInput.value) interestRateInput.value = '3.5';
                if (!loanTermInput.value) loanTermInput.value = '5';
                termUnitSelect.value = 'years';
                break;
                
            case 'personal':
                // Default values for personal loans
                if (!loanAmountInput.value) loanAmountInput.value = '10000';
                if (!interestRateInput.value) interestRateInput.value = '8.0';
                if (!loanTermInput.value) loanTermInput.value = '3';
                termUnitSelect.value = 'years';
                break;
                
            case 'student':
                // Default values for student loans
                if (!loanAmountInput.value) loanAmountInput.value = '20000';
                if (!interestRateInput.value) interestRateInput.value = '5.0';
                if (!loanTermInput.value) loanTermInput.value = '10';
                termUnitSelect.value = 'years';
                break;
                
            case 'business':
                // Default values for business loans
                if (!loanAmountInput.value) loanAmountInput.value = '100000';
                if (!interestRateInput.value) interestRateInput.value = '6.0';
                if (!loanTermInput.value) loanTermInput.value = '7';
                termUnitSelect.value = 'years';
                break;
        }
    }
    
    // Format currency
    function formatCurrency(amount) {
        return '$' + amount.toFixed(settings.decimalPlaces);
    }
    
    // Calculate loan details
    function calculate() {
        // Get input values
        const loanAmount = parseFloat(loanAmountInput.value) || 0;
        const interestRate = parseFloat(interestRateInput.value) || 0;
        const loanTerm = parseFloat(loanTermInput.value) || 0;
        const termUnit = termUnitSelect.value;
        const paymentFrequency = paymentFrequencySelect.value;
        
        // Validate inputs
        if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
            clearResult();
            return;
        }
        
        // Calculate number of payments and periodic interest rate
        let numberOfPayments, periodicInterestRate;
        
        // Convert annual interest rate to decimal and then to periodic rate
        const annualInterestRate = interestRate / 100;
        
        // Calculate based on payment frequency and term unit
        if (paymentFrequency === 'monthly') {
            // Monthly payments
            if (termUnit === 'years') {
                numberOfPayments = loanTerm * 12;
            } else { // months
                numberOfPayments = loanTerm;
            }
            periodicInterestRate = annualInterestRate / 12;
        } else if (paymentFrequency === 'bi-weekly') {
            // Bi-weekly payments (26 payments per year)
            if (termUnit === 'years') {
                numberOfPayments = loanTerm * 26;
            } else { // months
                numberOfPayments = (loanTerm / 12) * 26;
            }
            periodicInterestRate = annualInterestRate / 26;
        } else { // weekly
            // Weekly payments (52 payments per year)
            if (termUnit === 'years') {
                numberOfPayments = loanTerm * 52;
            } else { // months
                numberOfPayments = (loanTerm / 12) * 52;
            }
            periodicInterestRate = annualInterestRate / 52;
        }
        
        // Calculate periodic payment using the formula: PMT = P[r(1+r)^n]/[(1+r)^n-1]
        const periodicPayment = loanAmount * 
            (periodicInterestRate * Math.pow(1 + periodicInterestRate, numberOfPayments)) / 
            (Math.pow(1 + periodicInterestRate, numberOfPayments) - 1);
        
        // Calculate total payment and total interest
        const totalPayment = periodicPayment * numberOfPayments;
        const totalInterest = totalPayment - loanAmount;
        
        // Display results
        monthlyPaymentDisplay.textContent = formatCurrency(periodicPayment);
        totalPaymentDisplay.textContent = formatCurrency(totalPayment);
        totalInterestDisplay.textContent = formatCurrency(totalInterest);
        numberOfPaymentsDisplay.textContent = Math.round(numberOfPayments);
        
        // Generate amortization schedule
        generateAmortizationSchedule(loanAmount, periodicInterestRate, periodicPayment, numberOfPayments);
        
        // Show the result display
        resultDisplay.classList.remove('hidden');
    }
    
    // Generate amortization schedule
    function generateAmortizationSchedule(principal, periodicRate, periodicPayment, numberOfPayments) {
        // Clear existing table
        amortizationTableBody.innerHTML = '';
        
        let balance = principal;
        let totalInterest = 0;
        
        // Limit the number of rows to prevent performance issues
        const maxRows = 300; // Show at most 300 payments
        const displayedPayments = Math.min(numberOfPayments, maxRows);
        
        for (let i = 1; i <= displayedPayments; i++) {
            // Calculate interest for this period
            const interestPayment = balance * periodicRate;
            
            // Calculate principal for this period
            let principalPayment = periodicPayment - interestPayment;
            
            // Adjust for final payment if needed
            if (i === numberOfPayments) {
                principalPayment = balance;
                periodicPayment = principalPayment + interestPayment;
            }
            
            // Update balance
            balance -= principalPayment;
            if (balance < 0.001) balance = 0; // Fix for floating point errors
            
            // Update total interest
            totalInterest += interestPayment;
            
            // Create table row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-4 py-2 whitespace-nowrap">${i}</td>
                <td class="px-4 py-2 whitespace-nowrap">${formatCurrency(periodicPayment)}</td>
                <td class="px-4 py-2 whitespace-nowrap">${formatCurrency(principalPayment)}</td>
                <td class="px-4 py-2 whitespace-nowrap">${formatCurrency(interestPayment)}</td>
                <td class="px-4 py-2 whitespace-nowrap">${formatCurrency(balance)}</td>
            `;
            
            amortizationTableBody.appendChild(row);
        }
        
        // If we're not showing all payments, add a message
        if (numberOfPayments > maxRows) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="5" class="px-4 py-2 text-center text-gray-500 italic">
                    Showing first ${maxRows} payments of ${Math.round(numberOfPayments)} total payments
                </td>
            `;
            amortizationTableBody.appendChild(row);
        }
    }
    
    // Clear result display
    function clearResult() {
        resultDisplay.classList.add('hidden');
        amortizationSchedule.classList.add('hidden');
        toggleText.textContent = 'Show Amortization Schedule';
        toggleIcon.innerHTML = '<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />';
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('loanCalculatorSettings');
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                settings = { ...settings, ...parsedSettings };
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
    }
    
    // Save settings to localStorage
    function saveSettings() {
        try {
            localStorage.setItem('loanCalculatorSettings', JSON.stringify(settings));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    }
    
    // Apply settings to UI
    function applySettings() {
        autoCalculateCheckbox.checked = settings.autoCalculate;
        decimalPlacesSelect.value = settings.decimalPlaces.toString();
    }
    
    // Initialize the calculator
    initLoanCalculator();
});

// Add the loan calculator 3D icon to the Tool3DIcon object
if (typeof Tool3DIcon !== 'undefined') {
    // Create the loan calculator 3D icon
    Tool3DIcon.createToolIcon = function(toolType) {
        let geometry, material;
        let mesh;
        
        if (toolType === 'loan-calculator') {
            // Create a loan/money icon for loan calculator
            const loanGroup = new THREE.Group();
            
            // Dollar bill base
            const bill = new THREE.Mesh(
                new THREE.BoxGeometry(2.2, 1.3, 0.05),
                new THREE.MeshStandardMaterial({ 
                    color: 0x10B981, // Green color for money
                    metalness: 0.1,
                    roughness: 0.8
                })
            );
            loanGroup.add(bill);
            
            // Bill details - center circle
            const centerCircle = new THREE.Mesh(
                new THREE.CircleGeometry(0.4, 32),
                new THREE.MeshStandardMaterial({ 
                    color: 0xF3F4F6, // Light gray
                    metalness: 0.2,
                    roughness: 0.7
                })
            );
            centerCircle.position.z = 0.03;
            loanGroup.add(centerCircle);
            
            // Dollar sign
            const dollarSignGroup = new THREE.Group();
            
            // Vertical line of dollar sign
            const dollarLine = new THREE.Mesh(
                new THREE.BoxGeometry(0.08, 0.5, 0.03),
                new THREE.MeshStandardMaterial({ 
                    color: 0x10B981, // Green
                    metalness: 0.3,
                    roughness: 0.7
                })
            );
            dollarSignGroup.add(dollarLine);
            
            // S curve of dollar sign (simplified with two curved lines)
            const curve1 = new THREE.Mesh(
                new THREE.TorusGeometry(0.12, 0.04, 16, 16, Math.PI),
                new THREE.MeshStandardMaterial({ 
                    color: 0x10B981, // Green
                    metalness: 0.3,
                    roughness: 0.7
                })
            );
            curve1.position.y = 0.12;
            curve1.rotation.z = Math.PI / 2;
            dollarSignGroup.add(curve1);
            
            const curve2 = new THREE.Mesh(
                new THREE.TorusGeometry(0.12, 0.04, 16, 16, Math.PI),
                new THREE.MeshStandardMaterial({ 
                    color: 0x10B981, // Green
                    metalness: 0.3,
                    roughness: 0.7
                })
            );
            curve2.position.y = -0.12;
            curve2.rotation.z = -Math.PI / 2;
            dollarSignGroup.add(curve2);
            
            dollarSignGroup.position.z = 0.06;
            loanGroup.add(dollarSignGroup);
            
            // Add coins stacked beside the bill
            const coinStack = new THREE.Group();
            coinStack.position.set(1.5, 0, 0.3);
            
            // Create several coins stacked on top of each other
            const coinColors = [0xFCD34D, 0xD1D5DB, 0xFCD34D]; // Gold, silver, gold
            for (let i = 0; i < 3; i++) {
                const coin = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.4, 0.4, 0.07, 32),
                    new THREE.MeshStandardMaterial({ 
                        color: coinColors[i],
                        metalness: 0.7,
                        roughness: 0.3
                    })
                );
                coin.position.y = i * 0.08;
                coin.rotation.x = Math.PI / 2;
                coinStack.add(coin);
                
                // Add coin detail (circle on top)
                const coinDetail = new THREE.Mesh(
                    new THREE.CircleGeometry(0.25, 32),
                    new THREE.MeshStandardMaterial({ 
                        color: coinColors[i] === 0xFCD34D ? 0xF59E0B : 0xA1A1AA,
                        metalness: 0.5,
                        roughness: 0.5
                    })
                );
                coinDetail.position.y = i * 0.08 + 0.04;
                coinDetail.rotation.x = -Math.PI / 2;
                coinStack.add(coinDetail);
            }
            
            loanGroup.add(coinStack);
            
            // Add a small house to represent mortgage/loans
            const house = new THREE.Group();
            house.position.set(-1.2, 0, 0.3);
            
            // House base
            const houseBase = new THREE.Mesh(
                new THREE.BoxGeometry(0.8, 0.5, 0.5),
                new THREE.MeshStandardMaterial({ 
                    color: 0x3B82F6, // Blue
                    metalness: 0.2,
                    roughness: 0.8
                })
            );
            house.add(houseBase);
            
            // House roof
            const roofGeometry = new THREE.ConeGeometry(0.6, 0.4, 4);
            const roof = new THREE.Mesh(
                roofGeometry,
                new THREE.MeshStandardMaterial({ 
                    color: 0x8B5CF6, // Purple
                    metalness: 0.2,
                    roughness: 0.8
                })
            );
            roof.position.y = 0.45;
            roof.rotation.y = Math.PI / 4;
            house.add(roof);
            
            // House door
            const door = new THREE.Mesh(
                new THREE.BoxGeometry(0.2, 0.3, 0.05),
                new THREE.MeshStandardMaterial({ 
                    color: 0xF59E0B, // Amber
                    metalness: 0.3,
                    roughness: 0.7
                })
            );
            door.position.set(0, -0.1, 0.28);
            house.add(door);
            
            // House window
            const window = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.15, 0.05),
                new THREE.MeshStandardMaterial({ 
                    color: 0xF3F4F6, // Light gray
                    metalness: 0.4,
                    roughness: 0.6,
                    transparent: true,
                    opacity: 0.8
                })
            );
            window.position.set(0, 0.15, 0.28);
            house.add(window);
            
            loanGroup.add(house);
            
            mesh = loanGroup;
        } else {
            // If not a loan calculator, call the original function if it exists
            if (this._originalCreateToolIcon) {
                return this._originalCreateToolIcon(toolType);
            }
            
            // Default fallback
            geometry = new THREE.BoxGeometry(1, 1, 1);
            material = new THREE.MeshStandardMaterial({ color: 0x3B82F6 });
            mesh = new THREE.Mesh(geometry, material);
        }
        
        return mesh;
    };
    
    // Store the original function if it exists
    if (!Tool3DIcon._originalCreateToolIcon && Tool3DIcon.createToolIcon) {
        Tool3DIcon._originalCreateToolIcon = Tool3DIcon.createToolIcon;
    }
}
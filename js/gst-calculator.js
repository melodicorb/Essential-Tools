/**
 * GST Calculator - JavaScript functionality
 * Calculates GST inclusive and exclusive amounts, GST amount, and handles different tax rates.
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const calculationTypeSelect = document.getElementById('calculation-type');
    const gstRateSelect = document.getElementById('gst-rate');
    const customRateContainer = document.getElementById('custom-rate-container');
    const customGstRate = document.getElementById('custom-gst-rate');
    const priceLabel = document.getElementById('price-label');
    const priceValue = document.getElementById('price-value');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDisplay = document.getElementById('result-display');
    const priceExGst = document.getElementById('price-ex-gst');
    const gstAmount = document.getElementById('gst-amount');
    const priceIncGst = document.getElementById('price-inc-gst');
    const gstRateUsed = document.getElementById('gst-rate-used');
    const autoCalculateCheckbox = document.getElementById('auto-calculate');
    const decimalPlacesSelect = document.getElementById('decimal-places');
    
    // Settings
    let settings = {
        autoCalculate: true,
        decimalPlaces: 2
    };
    
    // Initialize the GST calculator
    function initGstCalculator() {
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
                Tool3DIcon.init(container, 'gst-calculator');
            }
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Calculation type change
        calculationTypeSelect.addEventListener('change', function() {
            updatePriceLabel();
            clearResult();
        });
        
        // GST rate change
        gstRateSelect.addEventListener('change', function() {
            toggleCustomRateField();
            if (settings.autoCalculate) {
                calculate();
            }
        });
        
        // Custom GST rate change
        customGstRate.addEventListener('input', function() {
            if (settings.autoCalculate) {
                calculate();
            }
        });
        
        // Price input change
        priceValue.addEventListener('input', function() {
            if (settings.autoCalculate) {
                calculate();
            }
        });
        
        // Calculate button click
        calculateBtn.addEventListener('click', function() {
            calculate();
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
    
    // Update price label based on calculation type
    function updatePriceLabel() {
        const calculationType = calculationTypeSelect.value;
        
        switch(calculationType) {
            case 'add-gst':
                priceLabel.textContent = 'Price (excluding GST)';
                break;
                
            case 'remove-gst':
                priceLabel.textContent = 'Price (including GST)';
                break;
                
            case 'calculate-gst-amount':
                priceLabel.textContent = 'Price (excluding GST)';
                break;
        }
    }
    
    // Toggle custom rate field visibility
    function toggleCustomRateField() {
        if (gstRateSelect.value === 'custom') {
            customRateContainer.classList.remove('hidden');
        } else {
            customRateContainer.classList.add('hidden');
        }
    }
    
    // Get the current GST rate
    function getCurrentGstRate() {
        if (gstRateSelect.value === 'custom') {
            return parseFloat(customGstRate.value) || 0;
        } else {
            return parseFloat(gstRateSelect.value) || 0;
        }
    }
    
    // Format currency
    function formatCurrency(amount) {
        return '$' + amount.toFixed(settings.decimalPlaces);
    }
    
    // Perform the GST calculation
    function calculate() {
        const calculationType = calculationTypeSelect.value;
        const gstRate = getCurrentGstRate() / 100; // Convert percentage to decimal
        const price = parseFloat(priceValue.value) || 0;
        
        if (price <= 0 || gstRate < 0) {
            clearResult();
            return;
        }
        
        let priceExcludingGst = 0;
        let priceIncludingGst = 0;
        let gstAmountValue = 0;
        
        switch(calculationType) {
            case 'add-gst':
                // Price entered is excluding GST
                priceExcludingGst = price;
                gstAmountValue = price * gstRate;
                priceIncludingGst = price + gstAmountValue;
                break;
                
            case 'remove-gst':
                // Price entered is including GST
                priceIncludingGst = price;
                priceExcludingGst = price / (1 + gstRate);
                gstAmountValue = priceIncludingGst - priceExcludingGst;
                break;
                
            case 'calculate-gst-amount':
                // Just calculate the GST amount
                priceExcludingGst = price;
                gstAmountValue = price * gstRate;
                priceIncludingGst = price + gstAmountValue;
                break;
        }
        
        // Display the results
        priceExGst.textContent = formatCurrency(priceExcludingGst);
        gstAmount.textContent = formatCurrency(gstAmountValue);
        priceIncGst.textContent = formatCurrency(priceIncludingGst);
        gstRateUsed.textContent = (gstRate * 100).toFixed(2) + '%';
        
        // Show the result display
        resultDisplay.classList.remove('hidden');
    }
    
    // Clear the result display
    function clearResult() {
        resultDisplay.classList.add('hidden');
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('gstCalculatorSettings');
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
            localStorage.setItem('gstCalculatorSettings', JSON.stringify(settings));
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
    initGstCalculator();
});
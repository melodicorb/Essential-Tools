/**
 * Prime Number Checker - JavaScript functionality
 * Checks if a number is prime or generates a list of prime numbers
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const toolMode = document.getElementById('tool-mode');
    const numberInput = document.getElementById('number-input');
    const startNumber = document.getElementById('start-number');
    const endNumber = document.getElementById('end-number');
    const checkPrimeInput = document.getElementById('check-prime-input');
    const generatePrimesInput = document.getElementById('generate-primes-input');
    const actionBtn = document.getElementById('action-btn');
    const resultDisplay = document.getElementById('result-display');
    const resultText = document.getElementById('result-text');
    const copyBtn = document.getElementById('copy-btn');
    const autoCheckCheckbox = document.getElementById('auto-check');
    
    // Settings
    let settings = {
        autoCheck: true
    };
    
    // Initialize the Prime Number Checker
    function initPrimeNumberChecker() {
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
                Tool3DIcon.init(container, 'prime-number');
            }
        }
        
        // Initialize mobile menu
        initMobileMenu();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Tool mode changes
        toolMode.addEventListener('change', function() {
            updateToolMode();
            updateActionButtonText();
            hideResult();
        });
        
        // Action button click
        actionBtn.addEventListener('click', function() {
            performAction();
        });
        
        // Auto-check input changes
        numberInput.addEventListener('input', function() {
            if (settings.autoCheck) {
                performAction();
            }
        });
        
        startNumber.addEventListener('input', function() {
            if (settings.autoCheck) {
                performAction();
            }
        });
        
        endNumber.addEventListener('input', function() {
            if (settings.autoCheck) {
                performAction();
            }
        });
        
        // Settings changes
        autoCheckCheckbox.addEventListener('change', function() {
            settings.autoCheck = this.checked;
            saveSettings();
        });
        
        // Copy button click
        copyBtn.addEventListener('click', function() {
            copyToClipboard(resultText.innerText);
        });
    }
    
    // Initialize mobile menu
    function initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
    
    // Update tool mode (check prime or generate primes)
    function updateToolMode() {
        const mode = toolMode.value;
        
        if (mode === 'check-prime') {
            checkPrimeInput.classList.remove('hidden');
            generatePrimesInput.classList.add('hidden');
        } else {
            checkPrimeInput.classList.add('hidden');
            generatePrimesInput.classList.remove('hidden');
        }
    }
    
    // Update action button text based on tool mode
    function updateActionButtonText() {
        const mode = toolMode.value;
        
        if (mode === 'check-prime') {
            actionBtn.textContent = 'Check Prime';
        } else {
            actionBtn.textContent = 'Generate Primes';
        }
    }
    
    // Perform the action based on the selected tool mode
    function performAction() {
        const mode = toolMode.value;
        
        if (mode === 'check-prime') {
            checkPrime();
        } else {
            generatePrimes();
        }
    }
    
    // Check if a number is prime
    function checkPrime() {
        const value = numberInput.value.trim();
        
        if (value === '') {
            hideResult();
            return;
        }
        
        try {
            // Validate input is a valid number
            if (!isValidNumber(value)) {
                showError('Please enter a valid positive integer');
                return;
            }
            
            const number = parseInt(value);
            const isPrime = isPrimeNumber(number);
            
            if (isPrime) {
                showResult(`<p class="text-green-600 font-semibold">${number} is a prime number.</p>`);
            } else {
                showResult(`<p class="text-red-600 font-semibold">${number} is not a prime number.</p>`);
                
                // If not prime, show its factors
                if (number > 1) {
                    const factors = getFactors(number);
                    showResult(`<p class="text-green-600 font-semibold">${number} is not a prime number.</p><p class="mt-2">Factors of ${number}: ${factors.join(', ')}</p>`);
                } else {
                    showResult(`<p class="text-red-600 font-semibold">${number} is not a prime number.</p><p class="mt-2">By definition, prime numbers are greater than 1.</p>`);
                }
            }
        } catch (error) {
            showError(error.message);
        }
    }
    
    // Generate a list of prime numbers in a range
    function generatePrimes() {
        const startValue = startNumber.value.trim();
        const endValue = endNumber.value.trim();
        
        if (startValue === '' || endValue === '') {
            hideResult();
            return;
        }
        
        try {
            // Validate inputs are valid numbers
            if (!isValidNumber(startValue) || !isValidNumber(endValue)) {
                showError('Please enter valid positive integers');
                return;
            }
            
            const start = parseInt(startValue);
            const end = parseInt(endValue);
            
            // Validate range
            if (start > end) {
                showError('Start number must be less than or equal to end number');
                return;
            }
            
            if (end > 10000) {
                showError('For performance reasons, please limit the end number to 10,000 or less');
                return;
            }
            
            const primes = getPrimesInRange(start, end);
            
            if (primes.length === 0) {
                showResult(`<p>No prime numbers found in the range ${start} to ${end}.</p>`);
            } else {
                showResult(`
                    <p class="mb-2">Found ${primes.length} prime number${primes.length === 1 ? '' : 's'} in the range ${start} to ${end}:</p>
                    <div class="bg-gray-100 p-3 rounded-md max-h-60 overflow-y-auto">
                        ${primes.join(', ')}
                    </div>
                `);
            }
        } catch (error) {
            showError(error.message);
        }
    }
    
    // Check if a number is prime
    function isPrimeNumber(num) {
        // 1 is not a prime number
        if (num <= 1) return false;
        
        // 2 and 3 are prime numbers
        if (num <= 3) return true;
        
        // Check if divisible by 2 or 3
        if (num % 2 === 0 || num % 3 === 0) return false;
        
        // Check using 6k +/- 1 optimization
        for (let i = 5; i * i <= num; i += 6) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
        }
        
        return true;
    }
    
    // Get all factors of a number
    function getFactors(num) {
        const factors = [];
        
        for (let i = 1; i <= num; i++) {
            if (num % i === 0) {
                factors.push(i);
            }
        }
        
        return factors;
    }
    
    // Get all prime numbers in a range
    function getPrimesInRange(start, end) {
        const primes = [];
        
        // Ensure start is at least 2 (smallest prime)
        const from = Math.max(2, start);
        
        for (let i = from; i <= end; i++) {
            if (isPrimeNumber(i)) {
                primes.push(i);
            }
        }
        
        return primes;
    }
    
    // Validate if input is a valid number for prime checking
    function isValidNumber(input) {
        // Must be a positive integer
        const number = parseInt(input);
        return /^\d+$/.test(input) && number >= 0;
    }
    
    // Show result
    function showResult(html) {
        resultText.innerHTML = html;
        resultDisplay.classList.remove('hidden');
        copyBtn.classList.remove('hidden');
    }
    
    // Hide result
    function hideResult() {
        resultDisplay.classList.add('hidden');
        copyBtn.classList.add('hidden');
    }
    
    // Show error
    function showError(message) {
        resultText.innerHTML = `<p class="text-red-600">Error: ${message}</p>`;
        resultDisplay.classList.remove('hidden');
        copyBtn.classList.add('hidden');
    }
    
    // Copy to clipboard
    function copyToClipboard(text) {
        // Create a temporary textarea element to copy from
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Change button text temporarily
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        
        setTimeout(function() {
            copyBtn.textContent = originalText;
        }, 2000);
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('primeNumberSettings');
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
            localStorage.setItem('primeNumberSettings', JSON.stringify(settings));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    }
    
    // Apply settings to UI
    function applySettings() {
        autoCheckCheckbox.checked = settings.autoCheck;
    }
    
    // Initialize the tool
    initPrimeNumberChecker();
});
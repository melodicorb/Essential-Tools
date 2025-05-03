/**
 * Currency Converter - JavaScript functionality
 * Converts between different currencies using real-time exchange rates
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fromValueInput = document.getElementById('from-value');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toValueInput = document.getElementById('to-value');
    const toCurrencySelect = document.getElementById('to-currency');
    const swapCurrenciesBtn = document.getElementById('swap-currencies-btn');
    const exchangeRateText = document.getElementById('exchange-rate-text');
    const lastUpdatedSpan = document.getElementById('last-updated');
    const autoConvertCheckbox = document.getElementById('auto-convert');
    const decimalPlacesSelect = document.getElementById('decimal-places');
    
    // Settings
    let settings = {
        autoConvert: true,
        decimalPlaces: 2
    };
    
    // Exchange rates data
    let exchangeRates = {};
    let lastUpdated = null;
    
    // List of common currencies
    const currencies = [
        { code: 'USD', name: 'US Dollar', symbol: '$' },
        { code: 'EUR', name: 'Euro', symbol: '€' },
        { code: 'GBP', name: 'British Pound', symbol: '£' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
        { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
        { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
        { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
        { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
        { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
        { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
        { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
        { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
        { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
        { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
        { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
        { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
        { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
        { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' }
    ];
    
    // Initialize the currency converter
    function initCurrencyConverter() {
        // Load saved settings if available
        loadSettings();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize currency selects
        populateCurrencySelects();
        
        // Apply settings
        applySettings();
        
        // Fetch exchange rates
        fetchExchangeRates();
        
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'currency-converter');
            }
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Input value change
        fromValueInput.addEventListener('input', function() {
            if (settings.autoConvert) {
                convert();
            }
        });
        
        // Currency selection change
        fromCurrencySelect.addEventListener('change', function() {
            updateExchangeRateInfo();
            convert();
        });
        
        toCurrencySelect.addEventListener('change', function() {
            updateExchangeRateInfo();
            convert();
        });
        
        // Swap currencies button
        swapCurrenciesBtn.addEventListener('click', function() {
            const tempCurrency = fromCurrencySelect.value;
            fromCurrencySelect.value = toCurrencySelect.value;
            toCurrencySelect.value = tempCurrency;
            
            // If there's a value in the to field, move it to the from field
            if (toValueInput.value) {
                fromValueInput.value = toValueInput.value;
            }
            
            updateExchangeRateInfo();
            convert();
        });
        
        // Settings changes
        autoConvertCheckbox.addEventListener('change', function() {
            settings.autoConvert = this.checked;
            saveSettings();
        });
        
        decimalPlacesSelect.addEventListener('change', function() {
            settings.decimalPlaces = parseInt(this.value);
            saveSettings();
            convert();
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
    
    // Populate currency select options
    function populateCurrencySelects() {
        // Clear existing options
        fromCurrencySelect.innerHTML = '';
        toCurrencySelect.innerHTML = '';
        
        // Add currency options
        currencies.forEach(currency => {
            const fromOption = document.createElement('option');
            fromOption.value = currency.code;
            fromOption.textContent = `${currency.code} - ${currency.name}`;
            fromCurrencySelect.appendChild(fromOption);
            
            const toOption = document.createElement('option');
            toOption.value = currency.code;
            toOption.textContent = `${currency.code} - ${currency.name}`;
            toCurrencySelect.appendChild(toOption);
        });
        
        // Set default selections (USD and EUR)
        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'EUR';
    }
    
    // Fetch exchange rates from API
    function fetchExchangeRates() {
        // For demo purposes, we'll use static exchange rates
        // In a real application, you would fetch from an API like:
        // fetch('https://api.exchangerate-api.com/v4/latest/USD')
        
        // Demo exchange rates (based on USD)
        exchangeRates = {
            USD: 1,
            EUR: 0.85,
            GBP: 0.73,
            JPY: 110.42,
            AUD: 1.35,
            CAD: 1.25,
            CHF: 0.92,
            CNY: 6.47,
            INR: 74.38,
            MXN: 19.85,
            BRL: 5.25,
            RUB: 73.96,
            KRW: 1156.45,
            SGD: 1.35,
            NZD: 1.42,
            HKD: 7.77,
            SEK: 8.58,
            ZAR: 14.38,
            TRY: 8.65,
            AED: 3.67
        };
        
        // Set last updated time
        lastUpdated = new Date();
        lastUpdatedSpan.textContent = formatDate(lastUpdated);
        
        // Update exchange rate info
        updateExchangeRateInfo();
        
        // Perform initial conversion
        convert();
    }
    
    // Update the exchange rate information display
    function updateExchangeRateInfo() {
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        if (exchangeRates && exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
            const rate = getExchangeRate(fromCurrency, toCurrency);
            exchangeRateText.textContent = `1 ${fromCurrency} = ${rate.toFixed(settings.decimalPlaces)} ${toCurrency}`;
        } else {
            exchangeRateText.textContent = 'Exchange rate data not available';
        }
    }
    
    // Get exchange rate between two currencies
    function getExchangeRate(fromCurrency, toCurrency) {
        // Convert through USD as base currency
        return exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    }
    
    // Perform the conversion
    function convert() {
        const fromValue = parseFloat(fromValueInput.value);
        
        if (isNaN(fromValue)) {
            toValueInput.value = '';
            return;
        }
        
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        if (exchangeRates && exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
            const rate = getExchangeRate(fromCurrency, toCurrency);
            const result = fromValue * rate;
            toValueInput.value = result.toFixed(settings.decimalPlaces);
        } else {
            toValueInput.value = 'N/A';
        }
    }
    
    // Format date for display
    function formatDate(date) {
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Apply settings to UI
    function applySettings() {
        autoConvertCheckbox.checked = settings.autoConvert;
        decimalPlacesSelect.value = settings.decimalPlaces;
    }
    
    // Save settings to localStorage
    function saveSettings() {
        localStorage.setItem('currencyConverterSettings', JSON.stringify(settings));
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('currencyConverterSettings');
        if (savedSettings) {
            settings = {...settings, ...JSON.parse(savedSettings)};
        }
    }
    
    // Initialize the currency converter
    initCurrencyConverter();
});

// Add 3D icon definition for the Currency Converter
if (typeof Tool3DIcon !== 'undefined') {
    Tool3DIcon.addIconDefinition('currency-converter', function(scene, container) {
        // Create a Currency Converter 3D model
        const group = new THREE.Group();
        
        // Base platform
        const baseGeometry = new THREE.BoxGeometry(2, 0.2, 2);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x3B82F6, // Blue color
            metalness: 0.2,
            roughness: 0.8
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.5;
        group.add(base);
        
        // Create coin stack 1 (dollars)
        const createCoinStack = (x, color, height) => {
            const stackGroup = new THREE.Group();
            stackGroup.position.set(x, -0.3, 0);
            
            const numCoins = Math.floor(height * 5);
            for (let i = 0; i < numCoins; i++) {
                const coinGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
                const coinMaterial = new THREE.MeshStandardMaterial({
                    color: color,
                    metalness: 0.7,
                    roughness: 0.3
                });
                const coin = new THREE.Mesh(coinGeometry, coinMaterial);
                coin.position.y = i * 0.06;
                coin.rotation.x = Math.PI / 2;
                stackGroup.add(coin);
            }
            
            return stackGroup;
        };
        
        // Add different coin stacks
        group.add(createCoinStack(-0.6, 0xFFD700, 1.2)); // Gold (USD)
        group.add(createCoinStack(0.6, 0xC0C0C0, 0.8));  // Silver (EUR)
        
        // Currency symbols
        const createCurrencySymbol = (symbol, x, color) => {
            const fontLoader = new THREE.FontLoader();
            
            // Since we can't load fonts dynamically in this environment,
            // we'll create simple symbol representations
            let symbolGeometry;
            
            if (symbol === '$') {
                // Dollar sign - vertical line with two slashes
                const symbolGroup = new THREE.Group();
                
                // Vertical line
                const lineGeometry = new THREE.BoxGeometry(0.05, 0.4, 0.05);
                const lineMaterial = new THREE.MeshStandardMaterial({ color: color });
                const line = new THREE.Mesh(lineGeometry, lineMaterial);
                symbolGroup.add(line);
                
                // Top slash
                const topSlashGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.05);
                const topSlash = new THREE.Mesh(topSlashGeometry, lineMaterial);
                topSlash.position.y = 0.15;
                topSlash.position.x = -0.05;
                symbolGroup.add(topSlash);
                
                // Bottom slash
                const bottomSlashGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.05);
                const bottomSlash = new THREE.Mesh(bottomSlashGeometry, lineMaterial);
                bottomSlash.position.y = -0.1;
                bottomSlash.position.x = -0.05;
                symbolGroup.add(bottomSlash);
                
                symbolGroup.position.set(x, 0.5, 0);
                return symbolGroup;
            } else if (symbol === '€') {
                // Euro sign - C with two horizontal lines
                const symbolGroup = new THREE.Group();
                
                // C shape (approximated with a partial torus)
                const cGeometry = new THREE.TorusGeometry(0.15, 0.05, 16, 16, Math.PI);
                const cMaterial = new THREE.MeshStandardMaterial({ color: color });
                const cShape = new THREE.Mesh(cGeometry, cMaterial);
                cShape.rotation.y = Math.PI / 2;
                symbolGroup.add(cShape);
                
                // Middle line
                const middleGeometry = new THREE.BoxGeometry(0.25, 0.05, 0.05);
                const middleLine = new THREE.Mesh(middleGeometry, cMaterial);
                middleLine.position.x = -0.05;
                symbolGroup.add(middleLine);
                
                // Top line
                const topGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.05);
                const topLine = new THREE.Mesh(topGeometry, cMaterial);
                topLine.position.x = -0.05;
                topLine.position.y = 0.1;
                symbolGroup.add(topLine);
                
                symbolGroup.position.set(x, 0.5, 0);
                return symbolGroup;
            }
            
            // Default simple cube for other symbols
            symbolGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.05);
            const symbolMaterial = new THREE.MeshStandardMaterial({ color: color });
            const symbolMesh = new THREE.Mesh(symbolGeometry, symbolMaterial);
            symbolMesh.position.set(x, 0.5, 0);
            return symbolMesh;
        };
        
        // Add currency symbols
        group.add(createCurrencySymbol('$', -0.6, 0xFFD700));
        group.add(createCurrencySymbol('€', 0.6, 0xC0C0C0));
        
        // Exchange arrows
        const arrowsGroup = new THREE.Group();
        
        // Right arrow
        const rightArrowGeometry = new THREE.ConeGeometry(0.1, 0.2, 8);
        const arrowMaterial = new THREE.MeshStandardMaterial({
            color: 0x10B981, // Green
            metalness: 0.3,
            roughness: 0.7,
            emissive: 0x10B981,
            emissiveIntensity: 0.2
        });
        const rightArrow = new THREE.Mesh(rightArrowGeometry, arrowMaterial);
        rightArrow.position.set(0.3, 0.3, 0);
        rightArrow.rotation.z = -Math.PI / 2;
        arrowsGroup.add(rightArrow);
        
        // Left arrow
        const leftArrowGeometry = new THREE.ConeGeometry(0.1, 0.2, 8);
        const leftArrow = new THREE.Mesh(leftArrowGeometry, arrowMaterial);
        leftArrow.position.set(-0.3, 0.3, 0);
        leftArrow.rotation.z = Math.PI / 2;
        arrowsGroup.add(leftArrow);
        
        // Arrow shaft
        const shaftGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.05);
        const shaftMaterial = new THREE.MeshStandardMaterial({
            color: 0x10B981,
            metalness: 0.3,
            roughness: 0.7
        });
        const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
        shaft.position.set(0, 0.3, 0);
        arrowsGroup.add(shaft);
        
        group.add(arrowsGroup);
        
        // Animation
        const animate = () => {
            const time = Date.now() * 0.001;
            
            // Rotate the entire model slightly
            group.rotation.y = Math.sin(time * 0.5) * 0.2;
            
            // Pulse the arrows
            const pulse = (Math.sin(time * 3) + 1) / 2;
            rightArrow.material.emissiveIntensity = 0.2 + pulse * 0.3;
            leftArrow.material.emissiveIntensity = 0.2 + pulse * 0.3;
            
            // Float the coin stacks slightly
            group.children.forEach((child, index) => {
                if (index > 0 && index < 3) { // Only affect the coin stacks
                    child.position.y = Math.sin(time * 1.5 + index) * 0.05 - 0.3;
                }
            });
        };
        
        return {
            group: group,
            animate: animate
        };
    });
}
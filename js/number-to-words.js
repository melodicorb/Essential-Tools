/**
 * Number to Words Converter - JavaScript functionality
 * Converts numeric values to their written word equivalents in multiple languages and formats
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const numberInput = document.getElementById('number-input');
    const languageSelect = document.getElementById('language');
    const formatSelect = document.getElementById('format');
    const convertBtn = document.getElementById('convert-btn');
    const resultDisplay = document.getElementById('result-display');
    const resultText = document.getElementById('result-text');
    const copyBtn = document.getElementById('copy-btn');
    const autoConvertCheckbox = document.getElementById('auto-convert');
    
    // Settings
    let settings = {
        autoConvert: true
    };
    
    // Initialize the number to words converter
    function initNumberToWordsConverter() {
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
                Tool3DIcon.init(container, 'number-to-words');
            }
        }
        
        // Initialize mobile menu
        initMobileMenu();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Convert button click
        convertBtn.addEventListener('click', function() {
            convert();
        });
        
        // Auto-convert input changes
        numberInput.addEventListener('input', function() {
            if (settings.autoConvert) {
                convert();
            }
        });
        
        // Format and language changes
        formatSelect.addEventListener('change', function() {
            if (settings.autoConvert && numberInput.value.trim() !== '') {
                convert();
            }
        });
        
        languageSelect.addEventListener('change', function() {
            if (settings.autoConvert && numberInput.value.trim() !== '') {
                convert();
            }
        });
        
        // Settings changes
        autoConvertCheckbox.addEventListener('change', function() {
            settings.autoConvert = this.checked;
            saveSettings();
        });
        
        // Copy button click
        copyBtn.addEventListener('click', function() {
            copyToClipboard(resultText.textContent);
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
    
    // Convert number to words
    function convert() {
        const number = numberInput.value.trim();
        const language = languageSelect.value;
        const format = formatSelect.value;
        
        if (number === '') {
            hideResult();
            return;
        }
        
        // Validate input is a number
        if (!isValidNumber(number)) {
            showError('Please enter a valid number');
            return;
        }
        
        try {
            const result = convertNumberToWords(number, language, format);
            showResult(result);
        } catch (error) {
            showError(error.message);
        }
    }
    
    // Validate if input is a valid number
    function isValidNumber(input) {
        // Allow numbers with optional decimal point and commas
        return /^-?\d{1,3}(,\d{3})*(\.\d+)?$|^-?\d+(\.\d+)?$/.test(input.replace(/\s/g, ''));
    }
    
    // Show result
    function showResult(result) {
        resultText.textContent = result;
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
        resultText.textContent = `Error: ${message}`;
        resultDisplay.classList.remove('hidden');
        copyBtn.classList.add('hidden');
    }
    
    // Copy to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            // Change button text temporarily
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            
            setTimeout(function() {
                copyBtn.textContent = originalText;
            }, 2000);
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('numberToWordsSettings');
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
            localStorage.setItem('numberToWordsSettings', JSON.stringify(settings));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    }
    
    // Apply settings to UI
    function applySettings() {
        autoConvertCheckbox.checked = settings.autoConvert;
    }
    
    // Convert number to words based on language and format
    function convertNumberToWords(number, language, format) {
        // Clean the input (remove commas and spaces)
        number = number.replace(/,|\s/g, '');
        
        // Parse the number
        const parsedNumber = parseFloat(number);
        
        // Check if number is within range
        if (Math.abs(parsedNumber) > 999999999999999) {
            throw new Error('Number is too large. Maximum supported is quadrillions.');
        }
        
        // Convert based on language and format
        switch (language) {
            case 'english':
                return convertEnglish(parsedNumber, format);
            case 'spanish':
                return convertSpanish(parsedNumber, format);
            case 'french':
                return convertFrench(parsedNumber, format);
            case 'german':
                return convertGerman(parsedNumber, format);
            case 'italian':
                return convertItalian(parsedNumber, format);
            default:
                return convertEnglish(parsedNumber, format);
        }
    }
    
    // English conversion
    function convertEnglish(number, format) {
        const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        const scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];
        const ordinals = {
            'one': 'first',
            'two': 'second',
            'three': 'third',
            'four': 'fourth',
            'five': 'fifth',
            'six': 'sixth',
            'seven': 'seventh',
            'eight': 'eighth',
            'nine': 'ninth',
            'twelve': 'twelfth',
            'twenty': 'twentieth',
            'thirty': 'thirtieth',
            'forty': 'fortieth',
            'fifty': 'fiftieth',
            'sixty': 'sixtieth',
            'seventy': 'seventieth',
            'eighty': 'eightieth',
            'ninety': 'ninetieth'
        };
        
        // Handle negative numbers
        if (number < 0) {
            return 'negative ' + convertEnglish(Math.abs(number), format);
        }
        
        // Handle zero
        if (number === 0) {
            if (format === 'ordinal') return 'zeroth';
            return 'zero';
        }
        
        // Handle year format
        if (format === 'year' && number >= 1000 && number <= 9999) {
            const century = Math.floor(number / 100);
            const year = number % 100;
            
            let result = '';
            
            if (century > 0) {
                if (year === 0) {
                    // For years like 1900, 2000
                    return convertLessThanThousand(century, units, tens) + ' hundred';
                } else {
                    // For years like 1901, 2020
                    result = convertLessThanThousand(century, units, tens);
                    if (year < 10) {
                        result += ' oh ' + convertLessThanThousand(year, units, tens);
                    } else {
                        result += ' ' + convertLessThanThousand(year, units, tens);
                    }
                }
            }
            
            return result;
        }
        
        // Split number into integer and decimal parts
        const parts = number.toString().split('.');
        const integerPart = parseInt(parts[0]);
        const decimalPart = parts.length > 1 ? parseInt(parts[1]) : 0;
        
        // Convert integer part
        let result = '';
        let scaleIndex = 0;
        let n = integerPart;
        
        // Process each group of three digits
        while (n > 0) {
            const hundreds = n % 1000;
            if (hundreds !== 0) {
                const groupText = convertLessThanThousand(hundreds, units, tens) + ' ' + scales[scaleIndex];
                result = groupText + (result ? ' ' + result : '');
            }
            n = Math.floor(n / 1000);
            scaleIndex++;
        }
        
        // Apply format-specific modifications
        switch (format) {
            case 'currency':
                result = result.trim() || 'zero';
                result += ' dollars';
                
                // Add cents if there are any
                if (decimalPart > 0) {
                    // Ensure two decimal places
                    let centsText = decimalPart.toString().padEnd(2, '0');
                    if (centsText.length > 2) centsText = centsText.substring(0, 2);
                    
                    const cents = parseInt(centsText);
                    result += ' and ' + convertLessThanThousand(cents, units, tens) + ' cent' + (cents !== 1 ? 's' : '');
                }
                break;
                
            case 'ordinal':
                result = result.trim();
                // Apply ordinal rules
                const lastWord = result.split(' ').pop();
                if (ordinals[lastWord]) {
                    result = result.substring(0, result.length - lastWord.length) + ordinals[lastWord];
                } else if (lastWord.endsWith('y')) {
                    result = result.substring(0, result.length - lastWord.length) + lastWord.substring(0, lastWord.length - 1) + 'ieth';
                } else {
                    result += 'th';
                }
                break;
                
            case 'standard':
            default:
                // Add decimal part if there are any
                if (decimalPart > 0) {
                    result = result.trim() || 'zero';
                    result += ' point';
                    const decimalStr = decimalPart.toString();
                    for (let i = 0; i < decimalStr.length; i++) {
                        result += ' ' + units[parseInt(decimalStr[i])];
                    }
                }
                break;
        }
        
        return result.trim().charAt(0).toUpperCase() + result.trim().slice(1);
    }
    
    // Helper function to convert numbers less than 1000
    function convertLessThanThousand(number, units, tens) {
        let result = '';
        
        // Handle hundreds
        const hundred = Math.floor(number / 100);
        if (hundred > 0) {
            result = units[hundred] + ' hundred';
        }
        
        // Handle tens and units
        const remainder = number % 100;
        if (remainder > 0) {
            if (result !== '') {
                result += ' and ';
            }
            
            if (remainder < 20) {
                result += units[remainder];
            } else {
                const ten = Math.floor(remainder / 10);
                const unit = remainder % 10;
                result += tens[ten];
                if (unit > 0) {
                    result += '-' + units[unit];
                }
            }
        }
        
        return result;
    }
    
    // Spanish conversion (simplified implementation)
    function convertSpanish(number, format) {
        // Simplified implementation for Spanish
        // In a real application, this would be more comprehensive
        const units = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
        const tens = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
        
        // Basic implementation for demo purposes
        if (number < 20) {
            return units[Math.floor(number)];
        } else if (number < 100) {
            const ten = Math.floor(number / 10);
            const unit = Math.floor(number % 10);
            if (unit === 0) {
                return tens[ten];
            } else {
                return tens[ten] + ' y ' + units[unit];
            }
        }
        
        // For simplicity, return English for larger numbers in this demo
        return 'Número en español: ' + convertEnglish(number, 'standard');
    }
    
    // French conversion (simplified implementation)
    function convertFrench(number, format) {
        // Simplified implementation for French
        return 'Nombre en français: ' + convertEnglish(number, 'standard');
    }
    
    // German conversion (simplified implementation)
    function convertGerman(number, format) {
        // Simplified implementation for German
        return 'Nummer auf Deutsch: ' + convertEnglish(number, 'standard');
    }
    
    // Italian conversion (simplified implementation)
    function convertItalian(number, format) {
        // Simplified implementation for Italian
        return 'Numero in italiano: ' + convertEnglish(number, 'standard');
    }
    
    // Initialize the tool
    initNumberToWordsConverter();
});

// Add the number-to-words icon to the Tool3DIcon object if it doesn't exist yet
if (typeof Tool3DIcon !== 'undefined' && !Tool3DIcon.hasOwnProperty('createNumberToWordsIcon')) {
    Tool3DIcon.createNumberToWordsIcon = function(scene, colors) {
        // Create a group to hold all objects
        const group = new THREE.Group();
        
        // Create a stylized 3D text/number conversion icon
        
        // Base platform (book or document)
        const bookGeometry = new THREE.BoxGeometry(2.5, 0.2, 2);
        const bookMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xf5f5f5,
            specular: 0x111111,
            shininess: 30
        });
        const book = new THREE.Mesh(bookGeometry, bookMaterial);
        book.position.y = -0.5;
        group.add(book);
        
        // Page lines on the book
        const lineGeometry = new THREE.BoxGeometry(1.8, 0.02, 0.1);
        const lineMaterial = new THREE.MeshPhongMaterial({ color: 0xe0e0e0 });
        
        for (let i = 0; i < 5; i++) {
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.position.set(0, -0.38, -0.7 + i * 0.3);
            group.add(line);
        }
        
        // Create number "123"
        const textGeometry1 = new THREE.TextGeometry('123', {
            font: new THREE.Font(), // This would need a proper font
            size: 0.5,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: false
        });
        
        // Since we can't load fonts easily in this example, we'll create a substitute
        // Create a "123" using simple geometries
        const numberGroup = new THREE.Group();
        
        // Number 1
        const oneGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
        const numberMaterial = new THREE.MeshPhongMaterial({ color: colors.primary });
        const one = new THREE.Mesh(oneGeometry, numberMaterial);
        one.position.set(-0.5, 0, 0.5);
        numberGroup.add(one);
        
        // Number 2
        const twoGroup = new THREE.Group();
        const twoTop = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), numberMaterial);
        twoTop.position.set(0, 0.2, 0.5);
        const twoMiddle = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), numberMaterial);
        twoMiddle.position.set(0, 0, 0.5);
        const twoBottom = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), numberMaterial);
        twoBottom.position.set(0, -0.2, 0.5);
        const twoRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), numberMaterial);
        twoRight.position.set(0.1, 0.1, 0.5);
        const twoLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), numberMaterial);
        twoLeft.position.set(-0.1, -0.1, 0.5);
        twoGroup.add(twoTop, twoMiddle, twoBottom, twoRight, twoLeft);
        twoGroup.position.set(0, 0, 0);
        numberGroup.add(twoGroup);
        
        // Number 3
        const threeGroup = new THREE.Group();
        const threeTop = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), numberMaterial);
        threeTop.position.set(0, 0.2, 0.5);
        const threeMiddle = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), numberMaterial);
        threeMiddle.position.set(0, 0, 0.5);
        const threeBottom = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), numberMaterial);
        threeBottom.position.set(0, -0.2, 0.5);
        const threeRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), numberMaterial);
        threeRight.position.set(0.1, 0, 0.5);
        threeGroup.add(threeTop, threeMiddle, threeBottom, threeRight);
        threeGroup.position.set(0.5, 0, 0);
        numberGroup.add(threeGroup);
        
        numberGroup.position.set(0, 0.2, 0);
        group.add(numberGroup);
        
        // Arrow pointing to words
        const arrowGroup = new THREE.Group();
        const arrowShaft = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 1),
            new THREE.MeshPhongMaterial({ color: colors.secondary })
        );
        arrowShaft.position.set(0, -0.1, 0);
        
        const arrowHead = new THREE.Mesh(
            new THREE.ConeGeometry(0.15, 0.3, 8),
            new THREE.MeshPhongMaterial({ color: colors.secondary })
        );
        arrowHead.rotation.x = Math.PI / 2;
        arrowHead.position.set(0, -0.1, -0.6);
        
        arrowGroup.add(arrowShaft, arrowHead);
        group.add(arrowGroup);
        
        // Word "ABC" (representing words)
        const wordGroup = new THREE.Group();
        
        // Letter A
        const aGroup = new THREE.Group();
        const aLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), new THREE.MeshPhongMaterial({ color: colors.accent }));
        aLeft.position.set(-0.1, 0, 0);
        const aRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), new THREE.MeshPhongMaterial({ color: colors.accent }));
        aRight.position.set(0.1, 0, 0);
        const aTop = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), new THREE.MeshPhongMaterial({ color: colors.accent }));
        aTop.position.set(0, 0.2, 0);
        const aMiddle = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), new THREE.MeshPhongMaterial({ color: colors.accent }));
        aMiddle.position.set(0, 0, 0);
        aGroup.add(aLeft, aRight, aTop, aMiddle);
        aGroup.position.set(-0.5, 0, -0.5);
        wordGroup.add(aGroup);
        
        // Letter B
        const bGroup = new THREE.Group();
        const bLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), new THREE.MeshPhongMaterial({ color: colors.accent }));
        bLeft.position.set(-0.1, 0, 0);
        const bTopCurve = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), new THREE.MeshPhongMaterial({ color: colors.accent }));
        bTopCurve.position.set(0, 0.2, 0);
        const bMiddleCurve = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), new THREE.MeshPhongMaterial({ color: colors.accent }));
        bMiddleCurve.position.set(0, 0, 0);
        const bBottomCurve = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), new THREE.MeshPhongMaterial({ color: colors.accent }));
        bBottomCurve.position.set(0, -0.2, 0);
        const bRightTop = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.1), new THREE.MeshPhongMaterial({ color: colors.accent }));
        bRightTop.position.set(0.1, 0.1, 0);
        const bRightBottom = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.1), new THREE.MeshPhongMaterial({ color: colors.accent }));
        bRightBottom.position.set(0.1, -0.1, 0);
        bGroup.add(bLeft, bTopCurve, bMiddleCurve, bBottomCurve, bRightTop, bRightBottom);
        bGroup.position.set(0, 0, -0.5);
        wordGroup.add(bGroup);
        
        // Letter C
        const cGroup = new THREE.Group();
        const cLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), new THREE.MeshPhongMaterial({ color: colors.accent }));
        cLeft.position.set(-0.1, 0, 0);
        const cTop = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), new THREE.MeshPhongMaterial({ color: colors.accent }));
        cTop.position.set(0, 0.2, 0);
        const cBottom = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.1), new THREE.MeshPhongMaterial({ color: colors.accent }));
        cBottom.position.set(0, -0.2, 0);
        cGroup.add(cLeft, cTop, cBottom);
        cGroup.position.set(0.5, 0, -0.5);
        wordGroup.add(cGroup);
        
        wordGroup.position.set(0, 0.2, -0.5);
        group.add(wordGroup);
        
        // Animation
        const animate = () => {
            // Gentle floating animation
            const time = Date.now() * 0.001;
            group.position.y = Math.sin(time) * 0.1;
            group.rotation.y = Math.sin(time * 0.5) * 0.2;
            
            // Pulse effect on the arrow
            arrowGroup.scale.z = 0.8 + Math.sin(time * 2) * 0.2;
        };
        
        return { group, animate };
    };
}
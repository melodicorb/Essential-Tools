/**
 * Roman Numeral Converter - JavaScript functionality
 * Converts between Roman numerals and Arabic numbers
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const conversionMode = document.getElementById('conversion-mode');
    const arabicInput = document.getElementById('arabic-input');
    const romanInput = document.getElementById('roman-input');
    const arabicToRomanInput = document.getElementById('arabic-to-roman-input');
    const romanToArabicInput = document.getElementById('roman-to-arabic-input');
    const convertBtn = document.getElementById('convert-btn');
    const resultDisplay = document.getElementById('result-display');
    const resultText = document.getElementById('result-text');
    const copyBtn = document.getElementById('copy-btn');
    const autoConvertCheckbox = document.getElementById('auto-convert');
    
    // Settings
    let settings = {
        autoConvert: true
    };
    
    // Initialize the Roman Numeral Converter
    function initRomanNumeralConverter() {
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
                Tool3DIcon.init(container, 'roman-numeral');
            }
        }
        
        // Initialize mobile menu
        initMobileMenu();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Conversion mode changes
        conversionMode.addEventListener('change', function() {
            updateConversionMode();
            updateConvertButtonText();
            hideResult();
        });
        
        // Convert button click
        convertBtn.addEventListener('click', function() {
            performConversion();
        });
        
        // Auto-convert input changes
        arabicInput.addEventListener('input', function() {
            if (settings.autoConvert) {
                performConversion();
            }
        });
        
        romanInput.addEventListener('input', function() {
            if (settings.autoConvert) {
                performConversion();
            }
        });
        
        // Settings changes
        autoConvertCheckbox.addEventListener('change', function() {
            settings.autoConvert = this.checked;
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
    
    // Update conversion mode (Arabic to Roman or Roman to Arabic)
    function updateConversionMode() {
        const mode = conversionMode.value;
        
        if (mode === 'arabic-to-roman') {
            arabicToRomanInput.classList.remove('hidden');
            romanToArabicInput.classList.add('hidden');
        } else {
            arabicToRomanInput.classList.add('hidden');
            romanToArabicInput.classList.remove('hidden');
        }
    }
    
    // Update convert button text based on conversion mode
    function updateConvertButtonText() {
        const mode = conversionMode.value;
        
        if (mode === 'arabic-to-roman') {
            convertBtn.textContent = 'Convert to Roman';
        } else {
            convertBtn.textContent = 'Convert to Arabic';
        }
    }
    
    // Perform the conversion based on the selected mode
    function performConversion() {
        const mode = conversionMode.value;
        
        if (mode === 'arabic-to-roman') {
            convertArabicToRoman();
        } else {
            convertRomanToArabic();
        }
    }
    
    // Convert Arabic number to Roman numeral
    function convertArabicToRoman() {
        const value = arabicInput.value.trim();
        
        if (value === '') {
            hideResult();
            return;
        }
        
        try {
            // Validate input is a valid number
            if (!isValidArabicNumber(value)) {
                showError('Please enter a valid number between 1 and 3999');
                return;
            }
            
            const number = parseInt(value);
            const romanNumeral = arabicToRoman(number);
            
            showResult(`<p class="text-green-600 font-semibold">${number} in Roman numerals is:</p><p class="text-2xl mt-2">${romanNumeral}</p>`);
        } catch (error) {
            showError(error.message);
        }
    }
    
    // Convert Roman numeral to Arabic number
    function convertRomanToArabic() {
        const value = romanInput.value.trim().toUpperCase();
        
        if (value === '') {
            hideResult();
            return;
        }
        
        try {
            // Validate input is a valid Roman numeral
            if (!isValidRomanNumeral(value)) {
                showError('Please enter a valid Roman numeral using I, V, X, L, C, D, M symbols');
                return;
            }
            
            const number = romanToArabic(value);
            
            showResult(`<p class="text-green-600 font-semibold">${value} in Arabic numerals is:</p><p class="text-2xl mt-2">${number}</p>`);
        } catch (error) {
            showError(error.message);
        }
    }
    
    // Convert Arabic number to Roman numeral
    function arabicToRoman(num) {
        if (num < 1 || num > 3999) {
            throw new Error('Number must be between 1 and 3999');
        }
        
        const romanNumerals = [
            { value: 1000, symbol: 'M' },
            { value: 900, symbol: 'CM' },
            { value: 500, symbol: 'D' },
            { value: 400, symbol: 'CD' },
            { value: 100, symbol: 'C' },
            { value: 90, symbol: 'XC' },
            { value: 50, symbol: 'L' },
            { value: 40, symbol: 'XL' },
            { value: 10, symbol: 'X' },
            { value: 9, symbol: 'IX' },
            { value: 5, symbol: 'V' },
            { value: 4, symbol: 'IV' },
            { value: 1, symbol: 'I' }
        ];
        
        let result = '';
        let remaining = num;
        
        for (const { value, symbol } of romanNumerals) {
            while (remaining >= value) {
                result += symbol;
                remaining -= value;
            }
        }
        
        return result;
    }
    
    // Convert Roman numeral to Arabic number
    function romanToArabic(roman) {
        const romanValues = {
            'I': 1,
            'V': 5,
            'X': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'M': 1000
        };
        
        let result = 0;
        let prevValue = 0;
        
        // Process from right to left
        for (let i = roman.length - 1; i >= 0; i--) {
            const currentChar = roman[i];
            const currentValue = romanValues[currentChar];
            
            if (currentValue === undefined) {
                throw new Error(`Invalid Roman numeral character: ${currentChar}`);
            }
            
            // If current value is greater than or equal to previous value, add it
            // Otherwise, subtract it (for cases like IV, IX, etc.)
            if (currentValue >= prevValue) {
                result += currentValue;
            } else {
                result -= currentValue;
            }
            
            prevValue = currentValue;
        }
        
        return result;
    }
    
    // Validate Arabic number input
    function isValidArabicNumber(value) {
        const num = parseInt(value);
        return !isNaN(num) && num >= 1 && num <= 3999 && /^\d+$/.test(value);
    }
    
    // Validate Roman numeral input
    function isValidRomanNumeral(value) {
        // Check if the input contains only valid Roman numeral characters
        return /^[IVXLCDM]+$/.test(value) && value.length > 0;
    }
    
    // Show result
    function showResult(html) {
        resultText.innerHTML = html;
        resultDisplay.classList.remove('hidden');
        copyBtn.classList.remove('hidden');
    }
    
    // Show error
    function showError(message) {
        resultText.innerHTML = `<p class="text-red-600">${message}</p>`;
        resultDisplay.classList.remove('hidden');
        copyBtn.classList.add('hidden');
    }
    
    // Hide result
    function hideResult() {
        resultDisplay.classList.add('hidden');
        copyBtn.classList.add('hidden');
    }
    
    // Copy to clipboard
    function copyToClipboard(text) {
        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        
        // Select and copy the text
        textarea.select();
        document.execCommand('copy');
        
        // Remove the temporary textarea
        document.body.removeChild(textarea);
        
        // Show feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        
        // Reset button text after a delay
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('romanNumeralSettings');
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                settings = { ...settings, ...parsedSettings };
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }
    
    // Save settings to localStorage
    function saveSettings() {
        try {
            localStorage.setItem('romanNumeralSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }
    
    // Apply settings to UI
    function applySettings() {
        autoConvertCheckbox.checked = settings.autoConvert;
    }
    
    // Initialize the tool
    initRomanNumeralConverter();
});

// Add Roman Numeral 3D Icon to Tool3DIcon object
if (typeof Tool3DIcon !== 'undefined') {
    Tool3DIcon.createRomanNumeralIcon = function(scene, colors) {
        const group = new THREE.Group();
        
        // Create a tablet/stone slab for the Roman numerals
        const tablet = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 2, 0.2),
            new THREE.MeshStandardMaterial({ 
                color: 0xD1D5DB, // Stone gray color
                metalness: 0.1,
                roughness: 0.8
            })
        );
        group.add(tablet);
        
        // Add some texture/detail to the tablet
        const tabletBorder = new THREE.Mesh(
            new THREE.BoxGeometry(2.7, 2.2, 0.15),
            new THREE.MeshStandardMaterial({ 
                color: 0x9CA3AF, // Darker gray for border
                metalness: 0.1,
                roughness: 0.9
            })
        );
        tabletBorder.position.z = -0.05;
        group.add(tabletBorder);
        
        // Create Roman numerals (simplified as 3D text objects)
        const createRomanNumeral = (symbol, position) => {
            const textGeometry = new THREE.TextGeometry(symbol, {
                font: new THREE.Font(), // This would normally require a loaded font
                size: 0.4,
                height: 0.05,
                curveSegments: 12,
                bevelEnabled: false
            });
            
            // Since we can't load fonts easily, we'll use simple geometries instead
            let mesh;
            
            // Create different shapes based on the Roman numeral
            switch(symbol) {
                case 'I':
                    mesh = new THREE.Mesh(
                        new THREE.BoxGeometry(0.1, 0.5, 0.05),
                        new THREE.MeshStandardMaterial({ color: 0x8B5CF6 }) // Purple
                    );
                    break;
                case 'V':
                    const vShape = new THREE.Shape();
                    vShape.moveTo(0, 0.25);
                    vShape.lineTo(0.25, -0.25);
                    vShape.lineTo(0.5, 0.25);
                    const vGeometry = new THREE.ExtrudeGeometry(vShape, {
                        depth: 0.05,
                        bevelEnabled: false
                    });
                    mesh = new THREE.Mesh(
                        vGeometry,
                        new THREE.MeshStandardMaterial({ color: 0x3B82F6 }) // Blue
                    );
                    break;
                case 'X':
                    const xGroup = new THREE.Group();
                    
                    const line1 = new THREE.Mesh(
                        new THREE.BoxGeometry(0.1, 0.6, 0.05),
                        new THREE.MeshStandardMaterial({ color: 0x10B981 }) // Green
                    );
                    line1.rotation.z = Math.PI / 4;
                    xGroup.add(line1);
                    
                    const line2 = new THREE.Mesh(
                        new THREE.BoxGeometry(0.1, 0.6, 0.05),
                        new THREE.MeshStandardMaterial({ color: 0x10B981 }) // Green
                    );
                    line2.rotation.z = -Math.PI / 4;
                    xGroup.add(line2);
                    
                    mesh = xGroup;
                    break;
                default:
                    mesh = new THREE.Mesh(
                        new THREE.BoxGeometry(0.3, 0.5, 0.05),
                        new THREE.MeshStandardMaterial({ color: 0xF59E0B }) // Amber
                    );
            }
            
            mesh.position.set(position.x, position.y, position.z);
            return mesh;
        };
        
        // Add some Roman numerals to the tablet (MMXXIII - 2023)
        const numerals = [
            { symbol: 'M', position: { x: -0.9, y: 0, z: 0.15 } },
            { symbol: 'M', position: { x: -0.5, y: 0, z: 0.15 } },
            { symbol: 'X', position: { x: -0.1, y: 0, z: 0.15 } },
            { symbol: 'X', position: { x: 0.3, y: 0, z: 0.15 } },
            { symbol: 'I', position: { x: 0.7, y: 0, z: 0.15 } },
            { symbol: 'I', position: { x: 0.9, y: 0, z: 0.15 } },
            { symbol: 'I', position: { x: 1.1, y: 0, z: 0.15 } }
        ];
        
        numerals.forEach(numeral => {
            const mesh = createRomanNumeral(numeral.symbol, numeral.position);
            group.add(mesh);
        });
        
        scene.add(group);
        return group;
    };
}
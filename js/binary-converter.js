/**
 * Binary Converter - JavaScript functionality
 * Converts between binary, decimal, hexadecimal, and octal number systems
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const inputValue = document.getElementById('input-value');
    const fromType = document.getElementById('from-type');
    const toType = document.getElementById('to-type');
    const convertBtn = document.getElementById('convert-btn');
    const resultDisplay = document.getElementById('result');
    const copyBtn = document.getElementById('copy-btn');
    
    // Initialize the Binary Converter
    function initBinaryConverter() {
        // Set up event listeners
        setupEventListeners();
        
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'binary-converter');
            }
        }
        
        // Initialize mobile menu
        initMobileMenu();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Convert button click
        convertBtn.addEventListener('click', convertNumber);
        
        // Copy button click
        copyBtn.addEventListener('click', copyResult);
        
        // Input validation and auto-convert on input
        inputValue.addEventListener('input', function() {
            validateInput();
        });
        
        // From/To type change
        fromType.addEventListener('change', validateInput);
        toType.addEventListener('change', function() {
            if (inputValue.value.trim() !== '') {
                convertNumber();
            }
        });
        
        // Allow Enter key to trigger conversion
        inputValue.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                convertNumber();
            }
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
    
    // Validate input based on selected number system
    function validateInput() {
        const value = inputValue.value.trim();
        const type = fromType.value;
        
        if (value === '') {
            inputValue.classList.remove('border-red-500');
            resultDisplay.textContent = '';
            return true;
        }
        
        let isValid = false;
        let pattern;
        
        switch (type) {
            case 'binary':
                pattern = /^[01]+$/;
                isValid = pattern.test(value);
                break;
            case 'decimal':
                pattern = /^\d+$/;
                isValid = pattern.test(value);
                break;
            case 'hexadecimal':
                pattern = /^[0-9A-Fa-f]+$/;
                isValid = pattern.test(value);
                break;
            case 'octal':
                pattern = /^[0-7]+$/;
                isValid = pattern.test(value);
                break;
        }
        
        if (isValid) {
            inputValue.classList.remove('border-red-500');
            if (value !== '') {
                convertNumber();
            }
        } else {
            inputValue.classList.add('border-red-500');
            resultDisplay.textContent = `Invalid ${type} number format`;
            resultDisplay.classList.add('text-red-500');
        }
        
        return isValid;
    }
    
    // Convert number between different number systems
    function convertNumber() {
        if (!validateInput()) return;
        
        const value = inputValue.value.trim();
        if (value === '') return;
        
        const from = fromType.value;
        const to = toType.value;
        
        // Convert input to decimal first (as an intermediate step)
        let decimalValue;
        
        switch (from) {
            case 'binary':
                decimalValue = parseInt(value, 2);
                break;
            case 'decimal':
                decimalValue = parseInt(value, 10);
                break;
            case 'hexadecimal':
                decimalValue = parseInt(value, 16);
                break;
            case 'octal':
                decimalValue = parseInt(value, 8);
                break;
        }
        
        // Check if the conversion to decimal was successful
        if (isNaN(decimalValue)) {
            resultDisplay.textContent = 'Invalid input or conversion error';
            resultDisplay.classList.add('text-red-500');
            return;
        }
        
        // Convert from decimal to target number system
        let result;
        
        switch (to) {
            case 'binary':
                result = decimalValue.toString(2);
                break;
            case 'decimal':
                result = decimalValue.toString(10);
                break;
            case 'hexadecimal':
                result = decimalValue.toString(16).toUpperCase();
                break;
            case 'octal':
                result = decimalValue.toString(8);
                break;
        }
        
        // Display the result
        resultDisplay.textContent = result;
        resultDisplay.classList.remove('text-red-500');
    }
    
    // Copy result to clipboard
    function copyResult() {
        const result = resultDisplay.textContent;
        if (!result) return;
        
        // Create a temporary textarea element to copy from
        const textarea = document.createElement('textarea');
        textarea.value = result;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Show feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        
        // Reset button text after a delay
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }
    
    // Initialize the tool
    initBinaryConverter();
});

// Add Binary Converter 3D Icon to Tool3DIcon object
if (typeof Tool3DIcon !== 'undefined') {
    Tool3DIcon.createBinaryConverterIcon = function(scene, colors) {
        const group = new THREE.Group();
        
        // Create a binary digit display (0s and 1s)
        const createDigitDisplay = () => {
            const display = new THREE.Group();
            
            // Create a display background
            const displayBg = new THREE.Mesh(
                new THREE.BoxGeometry(2.4, 1.2, 0.1),
                new THREE.MeshStandardMaterial({ 
                    color: 0x111827, // Dark background
                    metalness: 0.3,
                    roughness: 0.7
                })
            );
            displayBg.position.y = 0.6;
            display.add(displayBg);
            
            // Create binary digits (0s and 1s)
            const createDigit = (value, x, y) => {
                const color = value === '1' ? 0x10B981 : 0x3B82F6; // Green for 1, Blue for 0
                
                const digit = new THREE.Mesh(
                    new THREE.BoxGeometry(0.25, 0.25, 0.05),
                    new THREE.MeshStandardMaterial({ 
                        color: color,
                        emissive: color,
                        emissiveIntensity: 0.5,
                        metalness: 0.2,
                        roughness: 0.3
                    })
                );
                digit.position.set(x, y, 0.08);
                return digit;
            };
            
            // Create a grid of binary digits
            const binarySequence = ['1', '0', '1', '0', '1', '1', '0', '1'];
            const startX = -0.9;
            const startY = 0.7;
            const spacing = 0.3;
            
            for (let row = 0; row < 2; row++) {
                for (let col = 0; col < 4; col++) {
                    const index = row * 4 + col;
                    const digit = createDigit(
                        binarySequence[index],
                        startX + col * spacing,
                        startY - row * spacing
                    );
                    display.add(digit);
                }
            }
            
            return display;
        };
        
        // Create a converter base
        const converterBase = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 0.3, 1.5),
            new THREE.MeshStandardMaterial({ 
                color: 0x374151, // Dark gray
                metalness: 0.4,
                roughness: 0.6
            })
        );
        converterBase.position.y = -0.15;
        group.add(converterBase);
        
        // Add the binary digit display
        const digitDisplay = createDigitDisplay();
        group.add(digitDisplay);
        
        // Add conversion arrows
        const createArrow = (x, y, rotation) => {
            const arrow = new THREE.Group();
            
            // Arrow shaft
            const shaft = new THREE.Mesh(
                new THREE.BoxGeometry(0.6, 0.1, 0.1),
                new THREE.MeshStandardMaterial({ color: 0x8B5CF6 }) // Purple
            );
            arrow.add(shaft);
            
            // Arrow head
            const head = new THREE.Mesh(
                new THREE.ConeGeometry(0.15, 0.3, 8),
                new THREE.MeshStandardMaterial({ color: 0x8B5CF6 }) // Purple
            );
            head.position.x = 0.3;
            head.rotation.z = -Math.PI / 2;
            arrow.add(head);
            
            arrow.position.set(x, y, 0.1);
            arrow.rotation.z = rotation;
            
            return arrow;
        };
        
        // Add arrows in different directions
        group.add(createArrow(-0.8, -0.5, Math.PI / 4));
        group.add(createArrow(0.8, -0.5, -Math.PI / 4));
        
        // Add conversion symbols
        const createSymbol = (text, x, y, color) => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const context = canvas.getContext('2d');
            context.fillStyle = '#' + color.toString(16).padStart(6, '0');
            context.font = 'bold 48px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(text, 32, 32);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true
            });
            
            const symbol = new THREE.Mesh(
                new THREE.PlaneGeometry(0.3, 0.3),
                material
            );
            
            symbol.position.set(x, y, 0.2);
            return symbol;
        };
        
        // Add symbols for different number systems
        group.add(createSymbol('2', -1.0, -0.7, 0x3B82F6)); // Binary (base 2)
        group.add(createSymbol('10', 0, -0.7, 0xF59E0B)); // Decimal (base 10)
        group.add(createSymbol('16', 1.0, -0.7, 0xEF4444)); // Hex (base 16)
        
        // Animate the binary digits
        const animateDigits = () => {
            // Find all digit meshes
            const digits = [];
            digitDisplay.traverse((child) => {
                if (child.isMesh && child.geometry.type === 'BoxGeometry' && 
                    (child.position.z > 0.05)) {
                    digits.push(child);
                }
            });
            
            // Randomly change some digits
            setInterval(() => {
                const randomDigit = digits[Math.floor(Math.random() * digits.length)];
                const isOne = randomDigit.material.color.getHex() === 0x10B981;
                
                // Toggle between 0 and 1
                const newColor = isOne ? 0x3B82F6 : 0x10B981;
                randomDigit.material.color.setHex(newColor);
                randomDigit.material.emissive.setHex(newColor);
            }, 500);
        };
        
        animateDigits();
        
        scene.add(group);
        return group;
    };
}
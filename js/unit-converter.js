/**
 * Unit Converter - JavaScript functionality
 * Converts between different units of measurement across various categories
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const conversionTypeSelect = document.getElementById('conversion-type');
    const fromValueInput = document.getElementById('from-value');
    const fromUnitSelect = document.getElementById('from-unit');
    const toValueInput = document.getElementById('to-value');
    const toUnitSelect = document.getElementById('to-unit');
    const swapUnitsBtn = document.getElementById('swap-units-btn');
    const formulaDisplay = document.getElementById('formula-display');
    const formulaText = document.getElementById('formula-text');
    const autoConvertCheckbox = document.getElementById('auto-convert');
    const decimalPlacesSelect = document.getElementById('decimal-places');
    const showFormulasCheckbox = document.getElementById('show-formulas');
    
    // Settings
    let settings = {
        autoConvert: true,
        decimalPlaces: 2,
        showFormulas: true
    };
    
    // Conversion units by type
    const unitTypes = {
        length: [
            { name: 'Kilometers', abbr: 'km', factor: 1000 },
            { name: 'Meters', abbr: 'm', factor: 1 },
            { name: 'Centimeters', abbr: 'cm', factor: 0.01 },
            { name: 'Millimeters', abbr: 'mm', factor: 0.001 },
            { name: 'Miles', abbr: 'mi', factor: 1609.344 },
            { name: 'Yards', abbr: 'yd', factor: 0.9144 },
            { name: 'Feet', abbr: 'ft', factor: 0.3048 },
            { name: 'Inches', abbr: 'in', factor: 0.0254 }
        ],
        weight: [
            { name: 'Tonnes', abbr: 't', factor: 1000 },
            { name: 'Kilograms', abbr: 'kg', factor: 1 },
            { name: 'Grams', abbr: 'g', factor: 0.001 },
            { name: 'Milligrams', abbr: 'mg', factor: 0.000001 },
            { name: 'Pounds', abbr: 'lb', factor: 0.45359237 },
            { name: 'Ounces', abbr: 'oz', factor: 0.028349523125 },
            { name: 'Stone', abbr: 'st', factor: 6.35029318 }
        ],
        temperature: [
            { name: 'Celsius', abbr: '°C' },
            { name: 'Fahrenheit', abbr: '°F' },
            { name: 'Kelvin', abbr: 'K' }
        ],
        volume: [
            { name: 'Cubic Meters', abbr: 'm³', factor: 1 },
            { name: 'Liters', abbr: 'L', factor: 0.001 },
            { name: 'Milliliters', abbr: 'mL', factor: 0.000001 },
            { name: 'Gallons (US)', abbr: 'gal', factor: 0.00378541 },
            { name: 'Quarts (US)', abbr: 'qt', factor: 0.000946353 },
            { name: 'Pints (US)', abbr: 'pt', factor: 0.000473176 },
            { name: 'Fluid Ounces (US)', abbr: 'fl oz', factor: 0.0000295735 },
            { name: 'Cubic Feet', abbr: 'ft³', factor: 0.0283168 },
            { name: 'Cubic Inches', abbr: 'in³', factor: 0.0000163871 }
        ],
        area: [
            { name: 'Square Kilometers', abbr: 'km²', factor: 1000000 },
            { name: 'Square Meters', abbr: 'm²', factor: 1 },
            { name: 'Square Centimeters', abbr: 'cm²', factor: 0.0001 },
            { name: 'Square Millimeters', abbr: 'mm²', factor: 0.000001 },
            { name: 'Square Miles', abbr: 'mi²', factor: 2589988.11 },
            { name: 'Acres', abbr: 'ac', factor: 4046.86 },
            { name: 'Square Yards', abbr: 'yd²', factor: 0.836127 },
            { name: 'Square Feet', abbr: 'ft²', factor: 0.092903 },
            { name: 'Square Inches', abbr: 'in²', factor: 0.00064516 }
        ],
        time: [
            { name: 'Years', abbr: 'yr', factor: 31536000 },
            { name: 'Months (avg)', abbr: 'mo', factor: 2628000 },
            { name: 'Weeks', abbr: 'wk', factor: 604800 },
            { name: 'Days', abbr: 'd', factor: 86400 },
            { name: 'Hours', abbr: 'hr', factor: 3600 },
            { name: 'Minutes', abbr: 'min', factor: 60 },
            { name: 'Seconds', abbr: 's', factor: 1 },
            { name: 'Milliseconds', abbr: 'ms', factor: 0.001 }
        ],
        speed: [
            { name: 'Meters per second', abbr: 'm/s', factor: 1 },
            { name: 'Kilometers per hour', abbr: 'km/h', factor: 0.277778 },
            { name: 'Miles per hour', abbr: 'mph', factor: 0.44704 },
            { name: 'Feet per second', abbr: 'ft/s', factor: 0.3048 },
            { name: 'Knots', abbr: 'kn', factor: 0.514444 }
        ],
        data: [
            { name: 'Bytes', abbr: 'B', factor: 1 },
            { name: 'Kilobytes', abbr: 'KB', factor: 1024 },
            { name: 'Megabytes', abbr: 'MB', factor: 1048576 },
            { name: 'Gigabytes', abbr: 'GB', factor: 1073741824 },
            { name: 'Terabytes', abbr: 'TB', factor: 1099511627776 },
            { name: 'Petabytes', abbr: 'PB', factor: 1125899906842624 },
            { name: 'Bits', abbr: 'bit', factor: 0.125 },
            { name: 'Kilobits', abbr: 'Kbit', factor: 128 },
            { name: 'Megabits', abbr: 'Mbit', factor: 131072 },
            { name: 'Gigabits', abbr: 'Gbit', factor: 134217728 }
        ]
    };
    
    // Initialize the unit converter
    function initUnitConverter() {
        // Load saved settings if available
        loadSettings();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize unit selects
        updateUnitSelects();
        
        // Apply settings
        applySettings();
        
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'unit-converter');
            }
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Conversion type change
        conversionTypeSelect.addEventListener('change', function() {
            updateUnitSelects();
            updateFormula();
            convert();
        });
        
        // Input value change
        fromValueInput.addEventListener('input', function() {
            if (settings.autoConvert) {
                convert();
            }
        });
        
        // Unit selection change
        fromUnitSelect.addEventListener('change', function() {
            updateFormula();
            convert();
        });
        
        toUnitSelect.addEventListener('change', function() {
            updateFormula();
            convert();
        });
        
        // Swap units button
        swapUnitsBtn.addEventListener('click', function() {
            const tempUnit = fromUnitSelect.value;
            fromUnitSelect.value = toUnitSelect.value;
            toUnitSelect.value = tempUnit;
            
            // If there's a value in the to field, move it to the from field
            if (toValueInput.value) {
                fromValueInput.value = toValueInput.value;
            }
            
            updateFormula();
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
        
        showFormulasCheckbox.addEventListener('change', function() {
            settings.showFormulas = this.checked;
            saveSettings();
            formulaDisplay.style.display = settings.showFormulas ? 'block' : 'none';
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
    
    // Update unit select options based on conversion type
    function updateUnitSelects() {
        const conversionType = conversionTypeSelect.value;
        const units = unitTypes[conversionType];
        
        // Clear existing options
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';
        
        // Add new options
        units.forEach((unit, index) => {
            const fromOption = document.createElement('option');
            fromOption.value = index;
            fromOption.textContent = `${unit.name} (${unit.abbr})`;
            fromUnitSelect.appendChild(fromOption);
            
            const toOption = document.createElement('option');
            toOption.value = index;
            toOption.textContent = `${unit.name} (${unit.abbr})`;
            toUnitSelect.appendChild(toOption);
        });
        
        // Set default selections (first and second options)
        fromUnitSelect.value = 0;
        toUnitSelect.value = units.length > 1 ? 1 : 0;
    }
    
    // Update conversion formula display
    function updateFormula() {
        const conversionType = conversionTypeSelect.value;
        const units = unitTypes[conversionType];
        const fromUnit = units[fromUnitSelect.value];
        const toUnit = units[toUnitSelect.value];
        
        if (conversionType === 'temperature') {
            // Temperature conversions have special formulas
            const formulas = {
                '0-1': '°F = (°C × 9/5) + 32',  // Celsius to Fahrenheit
                '0-2': 'K = °C + 273.15',       // Celsius to Kelvin
                '1-0': '°C = (°F - 32) × 5/9',  // Fahrenheit to Celsius
                '1-2': 'K = (°F - 32) × 5/9 + 273.15', // Fahrenheit to Kelvin
                '2-0': '°C = K - 273.15',       // Kelvin to Celsius
                '2-1': '°F = (K - 273.15) × 9/5 + 32' // Kelvin to Fahrenheit
            };
            
            const formulaKey = `${fromUnitSelect.value}-${toUnitSelect.value}`;
            formulaText.textContent = formulas[formulaKey] || 'No conversion needed';
        } else {
            // Standard unit conversions use factors
            if (fromUnit === toUnit) {
                formulaText.textContent = 'No conversion needed';
            } else {
                formulaText.textContent = `1 ${fromUnit.abbr} = ${(toUnit.factor / fromUnit.factor).toFixed(settings.decimalPlaces)} ${toUnit.abbr}`;
            }
        }
    }
    
    // Perform the conversion
    function convert() {
        const conversionType = conversionTypeSelect.value;
        const fromValue = parseFloat(fromValueInput.value);
        
        if (isNaN(fromValue)) {
            toValueInput.value = '';
            return;
        }
        
        const units = unitTypes[conversionType];
        const fromUnit = units[fromUnitSelect.value];
        const toUnit = units[toUnitSelect.value];
        
        let result;
        
        if (conversionType === 'temperature') {
            // Temperature conversions have special formulas
            result = convertTemperature(fromValue, parseInt(fromUnitSelect.value), parseInt(toUnitSelect.value));
        } else {
            // Standard unit conversions
            result = fromValue * (fromUnit.factor / toUnit.factor);
        }
        
        toValueInput.value = result.toFixed(settings.decimalPlaces);
    }
    
    // Convert temperature between Celsius, Fahrenheit, and Kelvin
    function convertTemperature(value, fromUnitIndex, toUnitIndex) {
        // 0: Celsius, 1: Fahrenheit, 2: Kelvin
        let celsius;
        
        // Convert to Celsius first
        switch (fromUnitIndex) {
            case 0: // From Celsius
                celsius = value;
                break;
            case 1: // From Fahrenheit
                celsius = (value - 32) * 5/9;
                break;
            case 2: // From Kelvin
                celsius = value - 273.15;
                break;
        }
        
        // Convert from Celsius to target unit
        switch (toUnitIndex) {
            case 0: // To Celsius
                return celsius;
            case 1: // To Fahrenheit
                return (celsius * 9/5) + 32;
            case 2: // To Kelvin
                return celsius + 273.15;
            default:
                return value; // No conversion
        }
    }
    
    // Apply settings to UI
    function applySettings() {
        autoConvertCheckbox.checked = settings.autoConvert;
        decimalPlacesSelect.value = settings.decimalPlaces;
        showFormulasCheckbox.checked = settings.showFormulas;
        
        // Apply formula display setting
        formulaDisplay.style.display = settings.showFormulas ? 'block' : 'none';
    }
    
    // Save settings to localStorage
    function saveSettings() {
        localStorage.setItem('unitConverterSettings', JSON.stringify(settings));
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('unitConverterSettings');
        if (savedSettings) {
            settings = {...settings, ...JSON.parse(savedSettings)};
        }
    }
    
    // Initialize the unit converter
    initUnitConverter();
});

// Add 3D icon definition for the Unit Converter
if (typeof Tool3DIcon !== 'undefined') {
    Tool3DIcon.addIconDefinition('unit-converter', function(scene, container) {
        // Create a Unit Converter 3D model
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
        
        // Create scales
        const leftScaleGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.8);
        const rightScaleGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.8);
        const scaleMaterial = new THREE.MeshStandardMaterial({
            color: 0xF3F4F6, // Light gray
            metalness: 0.3,
            roughness: 0.7
        });
        
        const leftScale = new THREE.Mesh(leftScaleGeometry, scaleMaterial);
        leftScale.position.set(-0.6, 0, 0);
        group.add(leftScale);
        
        const rightScale = new THREE.Mesh(rightScaleGeometry, scaleMaterial);
        rightScale.position.set(0.6, 0, 0);
        group.add(rightScale);
        
        // Center pillar
        const pillarGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
        const pillarMaterial = new THREE.MeshStandardMaterial({
            color: 0x6B7280, // Gray
            metalness: 0.5,
            roughness: 0.5
        });
        const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillar.position.y = -0.1;
        group.add(pillar);
        
        // Horizontal beam
        const beamGeometry = new THREE.BoxGeometry(1.8, 0.05, 0.05);
        const beamMaterial = new THREE.MeshStandardMaterial({
            color: 0x6B7280, // Gray
            metalness: 0.5,
            roughness: 0.5
        });
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.position.y = 0.3;
        group.add(beam);
        
        // Scale connectors
        const leftConnectorGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
        const rightConnectorGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
        const connectorMaterial = new THREE.MeshStandardMaterial({
            color: 0x6B7280, // Gray
            metalness: 0.5,
            roughness: 0.5
        });
        
        const leftConnector = new THREE.Mesh(leftConnectorGeometry, connectorMaterial);
        leftConnector.position.set(-0.6, 0.15, 0);
        group.add(leftConnector);
        
        const rightConnector = new THREE.Mesh(rightConnectorGeometry, connectorMaterial);
        rightConnector.position.set(0.6, 0.15, 0);
        group.add(rightConnector);
        
        // Add weights to the scales
        const leftWeightGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
        const leftWeightMaterial = new THREE.MeshStandardMaterial({
            color: 0xEF4444, // Red
            metalness: 0.3,
            roughness: 0.7
        });
        const leftWeight = new THREE.Mesh(leftWeightGeometry, leftWeightMaterial);
        leftWeight.position.set(-0.6, 0.1, 0);
        group.add(leftWeight);
        
        const rightWeightGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
        const rightWeightMaterial = new THREE.MeshStandardMaterial({
            color: 0x10B981, // Green
            metalness: 0.3,
            roughness: 0.7
        });
        const rightWeight = new THREE.Mesh(rightWeightGeometry, rightWeightMaterial);
        rightWeight.position.set(0.6, 0.15, 0);
        group.add(rightWeight);
        
        // Add conversion symbols
        const arrowGeometry = new THREE.ConeGeometry(0.1, 0.2, 8);
        const arrowMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B5CF6, // Purple
            metalness: 0.3,
            roughness: 0.7,
            emissive: 0x8B5CF6,
            emissiveIntensity: 0.2
        });
        
        const leftArrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        leftArrow.position.set(-0.3, 0.3, 0);
        leftArrow.rotation.z = Math.PI / 2;
        group.add(leftArrow);
        
        const rightArrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        rightArrow.position.set(0.3, 0.3, 0);
        rightArrow.rotation.z = -Math.PI / 2;
        group.add(rightArrow);
        
        // Animation
        const animate = () => {
            const time = Date.now() * 0.001;
            
            // Make the scales balance
            leftScale.position.y = Math.sin(time) * 0.1;
            rightScale.position.y = Math.sin(time + Math.PI) * 0.1;
            
            // Adjust connectors
            leftConnector.position.y = 0.15 + leftScale.position.y / 2;
            leftConnector.scale.y = 1 - leftScale.position.y / 2;
            rightConnector.position.y = 0.15 + rightScale.position.y / 2;
            rightConnector.scale.y = 1 - rightScale.position.y / 2;
            
            // Move weights with scales
            leftWeight.position.y = 0.1 + leftScale.position.y;
            rightWeight.position.y = 0.15 + rightScale.position.y;
            
            // Pulse the arrows
            const pulse = (Math.sin(time * 3) + 1) / 2;
            leftArrow.material.emissiveIntensity = 0.2 + pulse * 0.3;
            rightArrow.material.emissiveIntensity = 0.2 + pulse * 0.3;
            
            // Rotate the entire model slightly
            group.rotation.y = Math.sin(time * 0.5) * 0.1;
        };
        
        return {
            group: group,
            animate: animate
        };
    });
}
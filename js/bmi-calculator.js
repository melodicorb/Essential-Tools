/**
 * BMI Calculator - JavaScript functionality
 * Provides BMI calculation with metric and imperial unit support
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const unitSystemRadios = document.querySelectorAll('input[name="unit-system"]');
    const metricInputs = document.getElementById('metric-inputs');
    const imperialInputs = document.getElementById('imperial-inputs');
    const weightKgInput = document.getElementById('weight-kg');
    const heightCmInput = document.getElementById('height-cm');
    const weightLbInput = document.getElementById('weight-lb');
    const heightFtInput = document.getElementById('height-ft');
    const heightInInput = document.getElementById('height-in');
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    const activityLevelSelect = document.getElementById('activity-level');
    const calculateBmiBtn = document.getElementById('calculate-bmi-btn');
    const bmiResultsSection = document.getElementById('bmi-results');
    const bmiValueElement = document.getElementById('bmi-value');
    const bmiCategoryElement = document.getElementById('bmi-category');
    const bmiInterpretationElement = document.getElementById('bmi-interpretation');
    const bmiIndicator = document.getElementById('bmi-indicator');
    const healthyWeightRange = document.getElementById('healthy-weight-range');
    const healthyWeightText = document.getElementById('healthy-weight-text');
    const bmiColorInput = document.getElementById('bmi-color');
    const displayPrecisionSelect = document.getElementById('display-precision');
    const showHealthTipsCheckbox = document.getElementById('show-health-tips');
    
    // State variables
    let settings = {
        bmiColor: '#10B981',
        displayPrecision: 2,
        showHealthTips: true
    };
    
    // Initialize the BMI calculator
    function initBmiCalculator() {
        // Load saved settings if available
        loadSettings();
        
        // Set up event listeners
        setupEventListeners();
        
        // Apply settings
        applySettings();
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'bmi-calculator');
            }
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Unit system change
        unitSystemRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'metric') {
                    metricInputs.classList.remove('hidden');
                    imperialInputs.classList.add('hidden');
                    // Convert imperial to metric if values exist
                    if (weightLbInput.value && heightFtInput.value) {
                        convertImperialToMetric();
                    }
                } else {
                    metricInputs.classList.add('hidden');
                    imperialInputs.classList.remove('hidden');
                    // Convert metric to imperial if values exist
                    if (weightKgInput.value && heightCmInput.value) {
                        convertMetricToImperial();
                    }
                }
            });
        });
        
        // Calculate button
        calculateBmiBtn.addEventListener('click', calculateBMI);
        
        // Settings changes
        bmiColorInput.addEventListener('change', function() {
            settings.bmiColor = this.value;
            saveSettings();
            applySettings();
        });
        
        displayPrecisionSelect.addEventListener('change', function() {
            settings.displayPrecision = parseInt(this.value);
            saveSettings();
            // Recalculate if results are already shown
            if (!bmiResultsSection.classList.contains('hidden')) {
                calculateBMI();
            }
        });
        
        showHealthTipsCheckbox.addEventListener('change', function() {
            settings.showHealthTips = this.checked;
            saveSettings();
            // Update display if results are already shown
            if (!bmiResultsSection.classList.contains('hidden')) {
                updateBmiInterpretation(parseFloat(bmiValueElement.textContent));
            }
        });
    }
    
    // Convert imperial measurements to metric
    function convertImperialToMetric() {
        const weightLb = parseFloat(weightLbInput.value);
        const heightFt = parseFloat(heightFtInput.value) || 0;
        const heightIn = parseFloat(heightInInput.value) || 0;
        
        if (weightLb) {
            // Convert pounds to kilograms (1 lb = 0.45359237 kg)
            const weightKg = weightLb * 0.45359237;
            weightKgInput.value = weightKg.toFixed(1);
        }
        
        if (heightFt || heightIn) {
            // Convert feet and inches to centimeters
            // (1 ft = 30.48 cm, 1 in = 2.54 cm)
            const totalInches = (heightFt * 12) + heightIn;
            const heightCm = totalInches * 2.54;
            heightCmInput.value = heightCm.toFixed(1);
        }
    }
    
    // Convert metric measurements to imperial
    function convertMetricToImperial() {
        const weightKg = parseFloat(weightKgInput.value);
        const heightCm = parseFloat(heightCmInput.value);
        
        if (weightKg) {
            // Convert kilograms to pounds (1 kg = 2.20462262 lb)
            const weightLb = weightKg * 2.20462262;
            weightLbInput.value = weightLb.toFixed(1);
        }
        
        if (heightCm) {
            // Convert centimeters to feet and inches
            // (1 cm = 0.393701 inches)
            const totalInches = heightCm * 0.393701;
            const heightFt = Math.floor(totalInches / 12);
            const heightIn = Math.round(totalInches % 12);
            
            heightFtInput.value = heightFt;
            heightInInput.value = heightIn;
        }
    }
    
    // Calculate BMI
    function calculateBMI() {
        let weight, height, bmi;
        const unitSystem = document.querySelector('input[name="unit-system"]:checked').value;
        
        if (unitSystem === 'metric') {
            weight = parseFloat(weightKgInput.value);
            height = parseFloat(heightCmInput.value);
            
            if (!weight || !height) {
                alert('Please enter both weight and height');
                return;
            }
            
            // BMI formula for metric: weight (kg) / (height (m))²
            bmi = weight / Math.pow(height / 100, 2);
        } else {
            weight = parseFloat(weightLbInput.value);
            const heightFt = parseFloat(heightFtInput.value) || 0;
            const heightIn = parseFloat(heightInInput.value) || 0;
            
            if (!weight || (!heightFt && !heightIn)) {
                alert('Please enter both weight and height');
                return;
            }
            
            // Convert height to total inches
            const totalInches = (heightFt * 12) + heightIn;
            
            // BMI formula for imperial: (weight (lb) * 703) / (height (in))²
            bmi = (weight * 703) / Math.pow(totalInches, 2);
        }
        
        // Display results
        displayBmiResults(bmi);
    }
    
    // Display BMI results
    function displayBmiResults(bmi) {
        // Round BMI to specified precision
        const roundedBmi = bmi.toFixed(settings.displayPrecision);
        
        // Show results section
        bmiResultsSection.classList.remove('hidden');
        
        // Update BMI value
        bmiValueElement.textContent = roundedBmi;
        
        // Determine BMI category
        let category, categoryColor;
        if (bmi < 18.5) {
            category = 'Underweight';
            categoryColor = '#3B82F6'; // blue
        } else if (bmi < 25) {
            category = 'Normal weight';
            categoryColor = '#10B981'; // green
        } else if (bmi < 30) {
            category = 'Overweight';
            categoryColor = '#F59E0B'; // amber
        } else {
            category = 'Obesity';
            categoryColor = '#EF4444'; // red
        }
        
        // Update category
        bmiCategoryElement.textContent = category;
        bmiCategoryElement.style.color = categoryColor;
        
        // Update BMI interpretation
        updateBmiInterpretation(bmi);
        
        // Update BMI indicator position
        updateBmiIndicator(bmi);
        
        // Show healthy weight range
        showHealthyWeightRange();
    }
    
    // Update BMI interpretation text
    function updateBmiInterpretation(bmi) {
        if (!settings.showHealthTips) {
            bmiInterpretationElement.innerHTML = '<p>Health tips are currently disabled. Enable them in settings to see recommendations.</p>';
            return;
        }
        
        let interpretation = '';
        
        if (bmi < 18.5) {
            interpretation = `
                <p class="mb-2">Your BMI suggests you may be underweight. This could indicate insufficient calorie intake or underlying health issues.</p>
                <p class="font-medium">Recommendations:</p>
                <ul class="list-disc list-inside space-y-1">
                    <li>Consult with a healthcare provider</li>
                    <li>Focus on nutrient-dense foods</li>
                    <li>Consider strength training to build muscle</li>
                    <li>Aim for gradual weight gain (0.5-1 lb per week)</li>
                </ul>
            `;
        } else if (bmi < 25) {
            interpretation = `
                <p class="mb-2">Your BMI is within the normal range. This is associated with good health and lower risk of weight-related diseases.</p>
                <p class="font-medium">Recommendations:</p>
                <ul class="list-disc list-inside space-y-1">
                    <li>Maintain a balanced diet</li>
                    <li>Stay physically active (150+ minutes/week)</li>
                    <li>Continue regular health check-ups</li>
                    <li>Focus on overall wellness and disease prevention</li>
                </ul>
            `;
        } else if (bmi < 30) {
            interpretation = `
                <p class="mb-2">Your BMI indicates you may be overweight. This can increase your risk for certain health conditions.</p>
                <p class="font-medium">Recommendations:</p>
                <ul class="list-disc list-inside space-y-1">
                    <li>Aim for moderate weight loss (5-10% of body weight)</li>
                    <li>Increase physical activity (both cardio and strength training)</li>
                    <li>Focus on portion control and balanced nutrition</li>
                    <li>Consider consulting with a healthcare provider</li>
                </ul>
            `;
        } else {
            interpretation = `
                <p class="mb-2">Your BMI suggests obesity, which is associated with higher risks for many health conditions including heart disease, diabetes, and certain cancers.</p>
                <p class="font-medium">Recommendations:</p>
                <ul class="list-disc list-inside space-y-1">
                    <li>Consult with healthcare providers for personalized advice</li>
                    <li>Set realistic weight loss goals (1-2 lbs per week)</li>
                    <li>Focus on sustainable lifestyle changes</li>
                    <li>Consider professional support (dietitian, trainer, etc.)</li>
                    <li>Monitor other health markers beyond weight</li>
                </ul>
            `;
        }
        
        // Add age-specific advice if age is provided
        const age = parseInt(ageInput.value);
        if (age) {
            if (age < 18) {
                interpretation += `
                    <p class="mt-3 text-blue-600 font-medium">Note: BMI calculations for individuals under 18 should be interpreted differently. Please consult with a pediatrician for proper assessment.</p>
                `;
            } else if (age > 65) {
                interpretation += `
                    <p class="mt-3 text-blue-600 font-medium">Note: For adults over 65, slightly higher BMI values (23-28) may be associated with better health outcomes.</p>
                `;
            }
        }
        
        bmiInterpretationElement.innerHTML = interpretation;
    }
    
    // Update BMI indicator on the scale
    function updateBmiIndicator(bmi) {
        // Calculate position percentage (capped between 0-100%)
        let position;
        if (bmi < 15) {
            position = 0;
        } else if (bmi > 35) {
            position = 100;
        } else {
            // Map BMI 15-35 to 0-100%
            position = ((bmi - 15) / 20) * 100;
        }
        
        // Update indicator position
        bmiIndicator.style.width = `${position}%`;
        
        // Update indicator color based on BMI category
        if (bmi < 18.5) {
            bmiIndicator.style.backgroundColor = '#3B82F6'; // blue
        } else if (bmi < 25) {
            bmiIndicator.style.backgroundColor = '#10B981'; // green
        } else if (bmi < 30) {
            bmiIndicator.style.backgroundColor = '#F59E0B'; // amber
        } else {
            bmiIndicator.style.backgroundColor = '#EF4444'; // red
        }
    }
    
    // Show healthy weight range
    function showHealthyWeightRange() {
        const unitSystem = document.querySelector('input[name="unit-system"]:checked').value;
        let height, minWeight, maxWeight, unit;
        
        if (unitSystem === 'metric') {
            height = parseFloat(heightCmInput.value);
            if (!height) return;
            
            // Calculate healthy weight range (BMI 18.5-24.9)
            const heightInMeters = height / 100;
            minWeight = 18.5 * Math.pow(heightInMeters, 2);
            maxWeight = 24.9 * Math.pow(heightInMeters, 2);
            unit = 'kg';
        } else {
            const heightFt = parseFloat(heightFtInput.value) || 0;
            const heightIn = parseFloat(heightInInput.value) || 0;
            if (!heightFt && !heightIn) return;
            
            // Convert height to total inches
            const totalInches = (heightFt * 12) + heightIn;
            
            // Calculate healthy weight range (BMI 18.5-24.9)
            minWeight = (18.5 * Math.pow(totalInches, 2)) / 703;
            maxWeight = (24.9 * Math.pow(totalInches, 2)) / 703;
            unit = 'lb';
        }
        
        // Display healthy weight range
        healthyWeightText.textContent = `Based on your height, a healthy weight range would be approximately ${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} ${unit}.`;
        healthyWeightRange.classList.remove('hidden');
    }
    
    // Apply settings to UI
    function applySettings() {
        // Set input values
        bmiColorInput.value = settings.bmiColor;
        displayPrecisionSelect.value = settings.displayPrecision.toString();
        showHealthTipsCheckbox.checked = settings.showHealthTips;
        
        // Apply theme color to UI elements
        document.querySelectorAll('.bg-green-600').forEach(el => {
            el.style.backgroundColor = settings.bmiColor;
        });
        
        document.querySelectorAll('.text-green-600').forEach(el => {
            el.style.color = settings.bmiColor;
        });
        
        document.querySelectorAll('.focus\\:ring-green-500').forEach(el => {
            el.classList.remove('focus:ring-green-500');
            el.classList.add('focus:ring-custom');
            el.style.setProperty('--tw-ring-color', settings.bmiColor);
        });
    }
    
    // Save settings to localStorage
    function saveSettings() {
        localStorage.setItem('bmiCalculatorSettings', JSON.stringify(settings));
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('bmiCalculatorSettings');
        if (savedSettings) {
            settings = {...settings, ...JSON.parse(savedSettings)};
        }
    }
    
    // Initialize the BMI calculator
    initBmiCalculator();
});

// Add 3D icon definition for the BMI calculator
if (typeof Tool3DIcon !== 'undefined') {
    Tool3DIcon.addIconDefinition('bmi-calculator', function(scene, container) {
        // Create a BMI calculator 3D model
        const group = new THREE.Group();
        
        // Base calculator shape
        const calculatorGeometry = new THREE.BoxGeometry(1.8, 0.2, 2.2);
        const calculatorMaterial = new THREE.MeshStandardMaterial({
            color: 0x10B981, // Green color
            metalness: 0.2,
            roughness: 0.8
        });
        const calculator = new THREE.Mesh(calculatorGeometry, calculatorMaterial);
        calculator.position.y = -0.4;
        group.add(calculator);
        
        // Display screen
        const screenGeometry = new THREE.BoxGeometry(1.4, 0.05, 0.8);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0xE5E7EB,
            metalness: 0.1,
            roughness: 0.3,
            emissive: 0xCCCCCC,
            emissiveIntensity: 0.2
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.y = -0.25;
        screen.position.z = 0.6;
        group.add(screen);
        
        // BMI indicator
        const indicatorGeometry = new THREE.BoxGeometry(0.8, 0.08, 0.1);
        const indicatorMaterial = new THREE.MeshStandardMaterial({
            color: 0x3B82F6, // Blue color
            metalness: 0.3,
            roughness: 0.5,
            emissive: 0x3B82F6,
            emissiveIntensity: 0.3
        });
        const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        indicator.position.y = -0.2;
        indicator.position.z = 0.2;
        group.add(indicator);
        
        // Create buttons
        const buttonColors = [0xEF4444, 0xF59E0B, 0x10B981, 0x3B82F6]; // Red, Amber, Green, Blue
        const buttonPositions = [
            {x: -0.6, z: -0.2},
            {x: -0.2, z: -0.2},
            {x: 0.2, z: -0.2},
            {x: 0.6, z: -0.2},
            {x: -0.6, z: -0.6},
            {x: -0.2, z: -0.6},
            {x: 0.2, z: -0.6},
            {x: 0.6, z: -0.6}
        ];
        
        buttonPositions.forEach((pos, index) => {
            const buttonGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
            const buttonMaterial = new THREE.MeshStandardMaterial({
                color: index < 4 ? buttonColors[index] : 0x6B7280,
                metalness: 0.2,
                roughness: 0.7
            });
            const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
            button.position.set(pos.x, -0.3, pos.z);
            button.rotation.x = Math.PI / 2;
            group.add(button);
        });
        
        // Add a human silhouette
        const silhouetteGeometry = new THREE.PlaneGeometry(0.4, 0.6);
        const silhouetteMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.8
        });
        const silhouette = new THREE.Mesh(silhouetteGeometry, silhouetteMaterial);
        silhouette.position.set(0, 0.2, 0.6);
        group.add(silhouette);
        
        // Animation
        const animate = () => {
            // Pulse the indicator
            const time = Date.now() * 0.001;
            indicator.position.x = Math.sin(time) * 0.3;
            indicator.material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.1;
            
            // Rotate the entire calculator slightly
            group.rotation.y = Math.sin(time * 0.5) * 0.1;
        };
        
        return {
            group: group,
            animate: animate
        };
    });
}
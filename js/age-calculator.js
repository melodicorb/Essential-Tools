/**
 * Age Calculator - JavaScript functionality
 * Calculates exact age in years, months, days and provides additional information
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const birthDayInput = document.getElementById('birth-day');
    const birthMonthSelect = document.getElementById('birth-month');
    const birthYearInput = document.getElementById('birth-year');
    const useTodayCheckbox = document.getElementById('use-today');
    const referenceDateInputs = document.getElementById('reference-date-inputs');
    const refDayInput = document.getElementById('ref-day');
    const refMonthSelect = document.getElementById('ref-month');
    const refYearInput = document.getElementById('ref-year');
    const calculateAgeBtn = document.getElementById('calculate-age-btn');
    const ageResultsSection = document.getElementById('age-results');
    const ageYearsElement = document.getElementById('age-years');
    const ageMonthsElement = document.getElementById('age-months');
    const ageDaysElement = document.getElementById('age-days');
    const totalMonthsElement = document.getElementById('total-months');
    const totalWeeksElement = document.getElementById('total-weeks');
    const totalDaysElement = document.getElementById('total-days');
    const totalHoursElement = document.getElementById('total-hours');
    const birthDayOfWeekElement = document.getElementById('birth-day-of-week');
    const zodiacSignElement = document.getElementById('zodiac-sign');
    const chineseZodiacElement = document.getElementById('chinese-zodiac');
    const nextBirthdayElement = document.getElementById('next-birthday');
    const daysToBirthdayElement = document.getElementById('days-to-birthday');
    const showAdditionalInfoCheckbox = document.getElementById('show-additional-info');
    const showZodiacInfoCheckbox = document.getElementById('show-zodiac-info');
    
    // Settings
    let settings = {
        showAdditionalInfo: true,
        showZodiacInfo: true
    };
    
    // Initialize the age calculator
    function initAgeCalculator() {
        // Load saved settings if available
        loadSettings();
        
        // Set up event listeners
        setupEventListeners();
        
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'age-calculator');
            }
        }
        
        // Pre-fill today's date in reference date fields
        fillTodayDate();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Toggle reference date inputs
        useTodayCheckbox.addEventListener('change', function() {
            if (this.checked) {
                referenceDateInputs.classList.add('hidden');
            } else {
                referenceDateInputs.classList.remove('hidden');
                // Fill with today's date if empty
                if (!refDayInput.value || !refMonthSelect.value || !refYearInput.value) {
                    fillTodayDate();
                }
            }
        });
        
        // Calculate button
        calculateAgeBtn.addEventListener('click', calculateAge);
        
        // Settings changes
        showAdditionalInfoCheckbox.addEventListener('change', function() {
            settings.showAdditionalInfo = this.checked;
            saveSettings();
            // Update display if results are already shown
            if (!ageResultsSection.classList.contains('hidden')) {
                updateAdditionalInfo(settings.showAdditionalInfo);
            }
        });
        
        showZodiacInfoCheckbox.addEventListener('change', function() {
            settings.showZodiacInfo = this.checked;
            saveSettings();
            // Update display if results are already shown
            if (!ageResultsSection.classList.contains('hidden')) {
                updateZodiacInfo(settings.showZodiacInfo);
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
    
    // Fill reference date inputs with today's date
    function fillTodayDate() {
        const today = new Date();
        refDayInput.value = today.getDate();
        refMonthSelect.value = today.getMonth();
        refYearInput.value = today.getFullYear();
    }
    
    // Calculate age
    function calculateAge() {
        // Get birth date
        const birthDay = parseInt(birthDayInput.value);
        const birthMonth = parseInt(birthMonthSelect.value);
        const birthYear = parseInt(birthYearInput.value);
        
        // Validate birth date inputs
        if (!birthDay || !birthMonth && birthMonth !== 0 || !birthYear) {
            alert('Please enter a valid birth date');
            return;
        }
        
        // Create birth date object
        const birthDate = new Date(birthYear, birthMonth, birthDay);
        
        // Validate birth date
        if (birthDate.getFullYear() !== birthYear || 
            birthDate.getMonth() !== birthMonth || 
            birthDate.getDate() !== birthDay) {
            alert('Please enter a valid birth date');
            return;
        }
        
        // Get reference date
        let referenceDate;
        if (useTodayCheckbox.checked) {
            referenceDate = new Date();
        } else {
            const refDay = parseInt(refDayInput.value);
            const refMonth = parseInt(refMonthSelect.value);
            const refYear = parseInt(refYearInput.value);
            
            // Validate reference date inputs
            if (!refDay || !refMonth && refMonth !== 0 || !refYear) {
                alert('Please enter a valid reference date');
                return;
            }
            
            // Create reference date object
            referenceDate = new Date(refYear, refMonth, refDay);
            
            // Validate reference date
            if (referenceDate.getFullYear() !== refYear || 
                referenceDate.getMonth() !== refMonth || 
                referenceDate.getDate() !== refDay) {
                alert('Please enter a valid reference date');
                return;
            }
        }
        
        // Check if birth date is in the future
        if (birthDate > referenceDate) {
            alert('Birth date cannot be in the future');
            return;
        }
        
        // Calculate age
        const ageData = calculateExactAge(birthDate, referenceDate);
        
        // Display results
        displayAgeResults(ageData, birthDate, referenceDate);
    }
    
    // Calculate exact age
    function calculateExactAge(birthDate, referenceDate) {
        let years = referenceDate.getFullYear() - birthDate.getFullYear();
        let months = referenceDate.getMonth() - birthDate.getMonth();
        let days = referenceDate.getDate() - birthDate.getDate();
        
        // Adjust months and years if days are negative
        if (days < 0) {
            // Get the last day of the previous month
            const lastDayOfPrevMonth = new Date(
                referenceDate.getFullYear(),
                referenceDate.getMonth(),
                0
            ).getDate();
            
            days += lastDayOfPrevMonth;
            months--;
        }
        
        // Adjust years if months are negative
        if (months < 0) {
            months += 12;
            years--;
        }
        
        // Calculate total days between dates
        const totalDays = Math.floor((referenceDate - birthDate) / (1000 * 60 * 60 * 24));
        
        return {
            years: years,
            months: months,
            days: days,
            totalDays: totalDays,
            totalMonths: years * 12 + months,
            totalWeeks: Math.floor(totalDays / 7),
            totalHours: totalDays * 24
        };
    }
    
    // Display age results
    function displayAgeResults(ageData, birthDate, referenceDate) {
        // Show results section
        ageResultsSection.classList.remove('hidden');
        
        // Update age values
        ageYearsElement.textContent = ageData.years;
        ageMonthsElement.textContent = ageData.months;
        ageDaysElement.textContent = ageData.days;
        
        // Update additional age information
        totalMonthsElement.textContent = ageData.totalMonths.toLocaleString();
        totalWeeksElement.textContent = ageData.totalWeeks.toLocaleString();
        totalDaysElement.textContent = ageData.totalDays.toLocaleString();
        totalHoursElement.textContent = ageData.totalHours.toLocaleString();
        
        // Update birth day of week
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        birthDayOfWeekElement.textContent = daysOfWeek[birthDate.getDay()];
        
        // Update zodiac sign
        const zodiacSign = getZodiacSign(birthDate.getMonth(), birthDate.getDate());
        zodiacSignElement.textContent = zodiacSign;
        
        // Update Chinese zodiac
        const chineseZodiac = getChineseZodiac(birthDate.getFullYear());
        chineseZodiacElement.textContent = chineseZodiac;
        
        // Calculate next birthday
        const nextBirthdayInfo = calculateNextBirthday(birthDate, referenceDate);
        nextBirthdayElement.textContent = nextBirthdayInfo.nextBirthdayDate;
        daysToBirthdayElement.textContent = nextBirthdayInfo.daysUntilBirthday;
        
        // Apply settings
        updateAdditionalInfo(settings.showAdditionalInfo);
        updateZodiacInfo(settings.showZodiacInfo);
    }
    
    // Get zodiac sign based on month and day
    function getZodiacSign(month, day) {
        const signs = [
            { name: 'Capricorn', startMonth: 11, startDay: 22, endMonth: 0, endDay: 19 },
            { name: 'Aquarius', startMonth: 0, startDay: 20, endMonth: 1, endDay: 18 },
            { name: 'Pisces', startMonth: 1, startDay: 19, endMonth: 2, endDay: 20 },
            { name: 'Aries', startMonth: 2, startDay: 21, endMonth: 3, endDay: 19 },
            { name: 'Taurus', startMonth: 3, startDay: 20, endMonth: 4, endDay: 20 },
            { name: 'Gemini', startMonth: 4, startDay: 21, endMonth: 5, endDay: 20 },
            { name: 'Cancer', startMonth: 5, startDay: 21, endMonth: 6, endDay: 22 },
            { name: 'Leo', startMonth: 6, startDay: 23, endMonth: 7, endDay: 22 },
            { name: 'Virgo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
            { name: 'Libra', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
            { name: 'Scorpio', startMonth: 9, startDay: 23, endMonth: 10, endDay: 21 },
            { name: 'Sagittarius', startMonth: 10, startDay: 22, endMonth: 11, endDay: 21 }
        ];
        
        for (const sign of signs) {
            // Special case for Capricorn (spans December to January)
            if (sign.name === 'Capricorn') {
                if ((month === 11 && day >= sign.startDay) || (month === 0 && day <= sign.endDay)) {
                    return sign.name;
                }
            } else {
                if ((month === sign.startMonth && day >= sign.startDay) || 
                    (month === sign.endMonth && day <= sign.endDay)) {
                    return sign.name;
                }
            }
        }
        
        return 'Unknown';
    }
    
    // Get Chinese zodiac animal based on year
    function getChineseZodiac(year) {
        const animals = [
            'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
            'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
        ];
        
        // Chinese zodiac operates on a 12-year cycle
        // 1900 is the year of the Rat (index 0)
        const index = (year - 1900) % 12;
        return animals[index >= 0 ? index : index + 12];
    }
    
    // Calculate next birthday and days until next birthday
    function calculateNextBirthday(birthDate, referenceDate) {
        // Create a date for this year's birthday
        const thisYearBirthday = new Date(
            referenceDate.getFullYear(),
            birthDate.getMonth(),
            birthDate.getDate()
        );
        
        // Create a date for next year's birthday
        const nextYearBirthday = new Date(
            referenceDate.getFullYear() + 1,
            birthDate.getMonth(),
            birthDate.getDate()
        );
        
        // Determine which birthday is next
        let nextBirthday;
        if (thisYearBirthday < referenceDate) {
            // This year's birthday has passed, use next year's
            nextBirthday = nextYearBirthday;
        } else {
            // This year's birthday is still upcoming
            nextBirthday = thisYearBirthday;
        }
        
        // Calculate days until next birthday
        const daysUntilBirthday = Math.ceil((nextBirthday - referenceDate) / (1000 * 60 * 60 * 24));
        
        // Format next birthday date
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const nextBirthdayDate = `${months[nextBirthday.getMonth()]} ${nextBirthday.getDate()}, ${nextBirthday.getFullYear()}`;
        
        return {
            nextBirthdayDate: nextBirthdayDate,
            daysUntilBirthday: daysUntilBirthday
        };
    }
    
    // Update additional info display based on settings
    function updateAdditionalInfo(show) {
        const additionalInfoElements = [
            totalMonthsElement.parentElement,
            totalWeeksElement.parentElement,
            totalDaysElement.parentElement,
            totalHoursElement.parentElement
        ];
        
        additionalInfoElements.forEach(element => {
            if (show) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        });
    }
    
    // Update zodiac info display based on settings
    function updateZodiacInfo(show) {
        const zodiacInfoElements = [
            zodiacSignElement.parentElement,
            chineseZodiacElement.parentElement
        ];
        
        zodiacInfoElements.forEach(element => {
            if (show) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        });
    }
    
    // Save settings to localStorage
    function saveSettings() {
        localStorage.setItem('ageCalculatorSettings', JSON.stringify(settings));
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('ageCalculatorSettings');
        if (savedSettings) {
            settings = {...settings, ...JSON.parse(savedSettings)};
            
            // Apply loaded settings to UI
            showAdditionalInfoCheckbox.checked = settings.showAdditionalInfo;
            showZodiacInfoCheckbox.checked = settings.showZodiacInfo;
        }
    }
    
    // Initialize the age calculator
    initAgeCalculator();
});

// Add 3D icon definition for the Age Calculator
if (typeof Tool3DIcon !== 'undefined') {
    Tool3DIcon.addIconDefinition('age-calculator', function(scene, container) {
        // Create an Age Calculator 3D model
        const group = new THREE.Group();
        
        // Calendar base
        const calendarGeometry = new THREE.BoxGeometry(1.8, 0.2, 2.2);
        const calendarMaterial = new THREE.MeshStandardMaterial({
            color: 0x3B82F6, // Blue color
            metalness: 0.2,
            roughness: 0.8
        });
        const calendar = new THREE.Mesh(calendarGeometry, calendarMaterial);
        calendar.position.y = -0.4;
        group.add(calendar);
        
        // Calendar top part
        const topGeometry = new THREE.BoxGeometry(1.8, 0.1, 0.8);
        const topMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B5CF6, // Purple color
            metalness: 0.3,
            roughness: 0.7
        });
        const calendarTop = new THREE.Mesh(topGeometry, topMaterial);
        calendarTop.position.y = -0.3;
        calendarTop.position.z = 0.7;
        group.add(calendarTop);
        
        // Calendar display
        const displayGeometry = new THREE.BoxGeometry(1.4, 0.05, 0.6);
        const displayMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            metalness: 0.1,
            roughness: 0.3,
            emissive: 0xCCCCCC,
            emissiveIntensity: 0.2
        });
        const display = new THREE.Mesh(displayGeometry, displayMaterial);
        display.position.y = -0.25;
        display.position.z = 0.7;
        group.add(display);
        
        // Create calendar grid
        const gridSize = 0.2;
        const gridGap = 0.05;
        const startX = -0.6;
        const startZ = -0.1;
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 5; col++) {
                const dayGeometry = new THREE.BoxGeometry(gridSize, 0.05, gridSize);
                const dayMaterial = new THREE.MeshStandardMaterial({
                    color: 0xE5E7EB,
                    metalness: 0.1,
                    roughness: 0.5
                });
                
                // Highlight one day (like a birthday)
                if (row === 1 && col === 2) {
                    dayMaterial.color.set(0xEF4444); // Red color
                    dayMaterial.emissive.set(0xEF4444);
                    dayMaterial.emissiveIntensity = 0.2;
                }
                
                const day = new THREE.Mesh(dayGeometry, dayMaterial);
                day.position.set(
                    startX + col * (gridSize + gridGap),
                    -0.3,
                    startZ - row * (gridSize + gridGap)
                );
                group.add(day);
            }
        }
        
        // Add a clock hand to represent time passing
        const handGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.6);
        const handMaterial = new THREE.MeshStandardMaterial({
            color: 0x3B82F6, // Blue color
            metalness: 0.3,
            roughness: 0.5
        });
        const hand = new THREE.Mesh(handGeometry, handMaterial);
        hand.position.y = 0;
        group.add(hand);
        
        // Add age numbers
        const numberGeometry = new THREE.TextGeometry('21', {
            size: 0.2,
            height: 0.05,
        });
        
        // Animation
        const animate = () => {
            // Rotate the clock hand
            const time = Date.now() * 0.001;
            hand.rotation.y = time * 0.5;
            
            // Pulse the highlighted day
            const highlightedDay = group.children.find(child => 
                child.material && child.material.emissiveIntensity !== undefined && 
                child.material.color.r > 0.8);
            
            if (highlightedDay) {
                highlightedDay.material.emissiveIntensity = 0.2 + Math.sin(time * 2) * 0.1;
            }
            
            // Rotate the entire calendar slightly
            group.rotation.y = Math.sin(time * 0.5) * 0.1;
        };
        
        return {
            group: group,
            animate: animate
        };
    });
}
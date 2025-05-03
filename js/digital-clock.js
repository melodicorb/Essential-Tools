/**
 * Digital Clock & Alarm - JavaScript functionality
 * Provides real-time clock with customizable display and alarm features
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const clockDisplay = document.getElementById('clock-display');
    const dateDisplay = document.getElementById('date-display');
    const timezoneDisplay = document.getElementById('timezone-display');
    const timezoneSelect = document.getElementById('timezone-select');
    const timeFormatSelect = document.getElementById('time-format');
    const showSecondsCheckbox = document.getElementById('show-seconds');
    const showDateCheckbox = document.getElementById('show-date');
    const alarmTimeInput = document.getElementById('alarm-time');
    const alarmEnabledCheckbox = document.getElementById('alarm-enabled');
    const testAlarmBtn = document.getElementById('test-alarm-btn');
    const alarmStatus = document.getElementById('alarm-status');
    const alarmTimeDisplay = document.getElementById('alarm-time-display');
    const clockColorInput = document.getElementById('clock-color');
    const clockFontSelect = document.getElementById('clock-font');
    const clockSizeSelect = document.getElementById('clock-size');
    
    // Clock state variables
    let clockInterval = null;
    let alarmSound = null;
    let alarmTimeout = null;
    let currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let timeFormat = '24';
    let showSeconds = true;
    let showDate = true;
    let alarmTime = null;
    let alarmEnabled = false;
    
    // Initialize the clock
    function initClock() {
        // Load saved settings if available
        loadSettings();
        
        // Populate timezone dropdown
        populateTimezones();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize alarm sound
        initAlarmSound();
        
        // Start the clock
        startClock();
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'digital-clock');
            }
        }
    }
    
    // Start the clock
    function startClock() {
        // Update immediately
        updateClock();
        
        // Set interval to update every second
        clockInterval = setInterval(updateClock, 1000);
    }
    
    // Update the clock display
    function updateClock() {
        const now = new Date();
        
        // Convert to selected timezone
        const options = { timeZone: currentTimezone };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const timeString = formatter.format(now);
        
        // Get localized time parts
        const timeParts = new Intl.DateTimeFormat('en-US', {
            timeZone: currentTimezone,
            hour: 'numeric',
            minute: 'numeric',
            second: showSeconds ? 'numeric' : undefined,
            hour12: timeFormat === '12'
        }).formatToParts(now);
        
        // Build time string
        let timeDisplay = '';
        timeParts.forEach(part => {
            if (part.type === 'hour' || part.type === 'minute' || 
                (part.type === 'second' && showSeconds) || 
                part.type === 'dayPeriod' || part.type === 'literal') {
                timeDisplay += part.value;
            }
        });
        
        // Update clock display
        clockDisplay.textContent = timeDisplay;
        
        // Update date if enabled
        if (showDate) {
            const dateParts = new Intl.DateTimeFormat('en-US', {
                timeZone: currentTimezone,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).formatToParts(now);
            
            let dateString = '';
            dateParts.forEach(part => {
                if (part.type !== 'literal' || part.value !== ', ') {
                    dateString += part.value;
                }
            });
            
            dateDisplay.textContent = dateString;
            dateDisplay.classList.remove('hidden');
        } else {
            dateDisplay.classList.add('hidden');
        }
        
        // Check if alarm should trigger
        checkAlarm(now);
    }
    
    // Populate timezone dropdown
    function populateTimezones() {
        // Get user's timezone
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Common timezones
        const timezones = [
            'UTC',
            'America/New_York',
            'America/Chicago',
            'America/Denver',
            'America/Los_Angeles',
            'Europe/London',
            'Europe/Paris',
            'Europe/Berlin',
            'Asia/Tokyo',
            'Asia/Shanghai',
            'Asia/Kolkata',
            'Australia/Sydney',
            'Pacific/Auckland'
        ];
        
        // Add user's timezone if not in the list
        if (!timezones.includes(userTimezone)) {
            timezones.unshift(userTimezone);
        }
        
        // Sort timezones
        timezones.sort();
        
        // Create options
        timezones.forEach(timezone => {
            const option = document.createElement('option');
            option.value = timezone;
            
            // Format timezone name for display
            const offset = getTimezoneOffset(timezone);
            option.textContent = `${timezone.replace('_', ' ')} (${offset})`;
            
            // Set selected if it's the user's timezone
            if (timezone === userTimezone) {
                option.selected = true;
                timezoneDisplay.textContent = offset;
            }
            
            timezoneSelect.appendChild(option);
        });
    }
    
    // Get formatted timezone offset
    function getTimezoneOffset(timezone) {
        const date = new Date();
        const options = { timeZone: timezone, timeZoneName: 'short' };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formatted = formatter.format(date);
        
        // Extract the timezone abbreviation
        const tzAbbr = formatted.split(' ').pop();
        
        // Get the offset in minutes
        const offsetInMinutes = new Date().toLocaleString('en-US', { timeZone: timezone }).getTimezoneOffset();
        const offsetHours = Math.abs(Math.floor(offsetInMinutes / 60));
        const offsetMinutes = Math.abs(offsetInMinutes % 60);
        const offsetSign = offsetInMinutes > 0 ? '-' : '+';
        
        return `UTC${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Timezone selection
        timezoneSelect.addEventListener('change', function() {
            currentTimezone = this.value;
            const selectedOption = this.options[this.selectedIndex];
            timezoneDisplay.textContent = selectedOption.textContent.split(' ').pop().replace('(', '').replace(')', '');
            updateClock();
            saveSettings();
        });
        
        // Time format selection
        timeFormatSelect.addEventListener('change', function() {
            timeFormat = this.value;
            updateClock();
            saveSettings();
        });
        
        // Show seconds toggle
        showSecondsCheckbox.addEventListener('change', function() {
            showSeconds = this.checked;
            updateClock();
            saveSettings();
        });
        
        // Show date toggle
        showDateCheckbox.addEventListener('change', function() {
            showDate = this.checked;
            updateClock();
            saveSettings();
        });
        
        // Alarm time input
        alarmTimeInput.addEventListener('change', function() {
            if (this.value) {
                alarmTime = this.value;
                alarmTimeDisplay.textContent = formatAlarmTimeForDisplay(alarmTime);
                saveSettings();
            }
        });
        
        // Alarm enabled toggle
        alarmEnabledCheckbox.addEventListener('change', function() {
            alarmEnabled = this.checked;
            alarmStatus.classList.toggle('hidden', !alarmEnabled);
            saveSettings();
        });
        
        // Test alarm button
        testAlarmBtn.addEventListener('click', function() {
            playAlarmSound();
            setTimeout(stopAlarmSound, 3000);
        });
        
        // Clock color
        clockColorInput.addEventListener('change', function() {
            clockDisplay.style.color = this.value;
            saveSettings();
        });
        
        // Clock font
        clockFontSelect.addEventListener('change', function() {
            updateClockFont();
            saveSettings();
        });
        
        // Clock size
        clockSizeSelect.addEventListener('change', function() {
            updateClockSize();
            saveSettings();
        });
    }
    
    // Format alarm time for display
    function formatAlarmTimeForDisplay(timeString) {
        if (!timeString) return '';
        
        const [hours, minutes] = timeString.split(':');
        const hoursNum = parseInt(hours, 10);
        
        if (timeFormat === '12') {
            const period = hoursNum >= 12 ? 'PM' : 'AM';
            const hours12 = hoursNum % 12 || 12;
            return `${hours12}:${minutes} ${period}`;
        } else {
            return `${hours}:${minutes}`;
        }
    }
    
    // Initialize alarm sound
    function initAlarmSound() {
        alarmSound = new Audio();
        alarmSound.src = 'data:audio/wav;base64,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';
        alarmSound.loop = true;
    }
    
    // Play alarm sound
    function playAlarmSound() {
        if (alarmSound) {
            alarmSound.play();
            
            // Create stop button
            const stopButton = document.createElement('button');
            stopButton.id = 'stop-alarm-btn';
            stopButton.className = 'mt-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors';
            stopButton.textContent = 'Stop Alarm';
            stopButton.addEventListener('click', stopAlarmSound);
            
            // Add to alarm status div
            alarmStatus.appendChild(stopButton);
        }
    }
    
    // Stop alarm sound
    function stopAlarmSound() {
        if (alarmSound) {
            alarmSound.pause();
            alarmSound.currentTime = 0;
            
            // Remove stop button if it exists
            const stopButton = document.getElementById('stop-alarm-btn');
            if (stopButton) {
                stopButton.remove();
            }
        }
    }
    
    // Check if alarm should trigger
    function checkAlarm(now) {
        if (!alarmEnabled || !alarmTime) return;
        
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentSeconds = now.getSeconds();
        
        const [alarmHours, alarmMinutes] = alarmTime.split(':').map(Number);
        
        if (currentHours === alarmHours && 
            currentMinutes === alarmMinutes && 
            currentSeconds === 0) {
            playAlarmSound();
        }
    }
    
    // Update clock font
    function updateClockFont() {
        const fontClass = clockFontSelect.value;
        
        // Remove existing font classes
        clockDisplay.classList.remove('font-mono', 'font-sans', 'font-serif');
        
        // Add selected font class
        switch (fontClass) {
            case 'mono':
                clockDisplay.classList.add('font-mono');
                break;
            case 'sans':
                clockDisplay.classList.add('font-sans');
                break;
            case 'serif':
                clockDisplay.classList.add('font-serif');
                break;
            case 'display':
                // Custom display font
                clockDisplay.style.fontFamily = "'Digital-7', monospace";
                break;
        }
    }
    
    // Update clock size
    function updateClockSize() {
        const sizeClass = clockSizeSelect.value;
        
        // Remove existing size classes
        clockDisplay.classList.remove('text-5xl', 'text-7xl', 'text-9xl');
        
        // Add selected size class
        switch (sizeClass) {
            case 'small':
                clockDisplay.classList.add('text-5xl');
                break;
            case 'normal':
                clockDisplay.classList.add('text-7xl');
                break;
            case 'large':
                clockDisplay.classList.add('text-9xl');
                break;
        }
    }
    
    // Save settings to localStorage
    function saveSettings() {
        const settings = {
            timezone: currentTimezone,
            timeFormat: timeFormat,
            showSeconds: showSeconds,
            showDate: showDate,
            alarmTime: alarmTime,
            alarmEnabled: alarmEnabled,
            clockColor: clockColorInput.value,
            clockFont: clockFontSelect.value,
            clockSize: clockSizeSelect.value
        };
        
        localStorage.setItem('digitalClockSettings', JSON.stringify(settings));
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('digitalClockSettings');
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // Apply saved settings
            currentTimezone = settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
            timeFormat = settings.timeFormat || '24';
            showSeconds = settings.showSeconds !== undefined ? settings.showSeconds : true;
            showDate = settings.showDate !== undefined ? settings.showDate : true;
            alarmTime = settings.alarmTime || null;
            alarmEnabled = settings.alarmEnabled || false;
            
            // Update UI elements
            timeFormatSelect.value = timeFormat;
            showSecondsCheckbox.checked = showSeconds;
            showDateCheckbox.checked = showDate;
            
            if (alarmTime) {
                alarmTimeInput.value = alarmTime;
                alarmTimeDisplay.textContent = formatAlarmTimeForDisplay(alarmTime);
            }
            
            alarmEnabledCheckbox.checked = alarmEnabled;
            alarmStatus.classList.toggle('hidden', !alarmEnabled);
            
            if (settings.clockColor) {
                clockColorInput.value = settings.clockColor;
                clockDisplay.style.color = settings.clockColor;
            }
            
            if (settings.clockFont) {
                clockFontSelect.value = settings.clockFont;
                updateClockFont();
            }
            
            if (settings.clockSize) {
                clockSizeSelect.value = settings.clockSize;
                updateClockSize();
            }
        }
    }
    
    // Initialize the clock
    initClock();
});
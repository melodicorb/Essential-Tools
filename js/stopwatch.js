/**
 * Stopwatch & Timer - JavaScript functionality
 * Provides precise time tracking with lap timing functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const stopwatchDisplay = document.getElementById('stopwatch-display');
    const elapsedTimeDisplay = document.getElementById('elapsed-time');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const lapBtn = document.getElementById('lap-btn');
    const resetBtn = document.getElementById('reset-btn');
    const displayFormatSelect = document.getElementById('display-format');
    const stopwatchColorInput = document.getElementById('stopwatch-color');
    const autoLapCheckbox = document.getElementById('auto-lap');
    const autoLapTimeInput = document.getElementById('auto-lap-time');
    const lapTimesContainer = document.getElementById('lap-times-container');
    const lapTimesTable = document.getElementById('lap-times');
    
    // Stopwatch state variables
    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval = null;
    let isRunning = false;
    let pausedTime = 0;
    let laps = [];
    let lastLapTime = 0;
    let autoLapInterval = null;
    
    // Initialize the stopwatch
    function initStopwatch() {
        // Load saved settings if available
        loadSettings();
        
        // Set up event listeners
        setupEventListeners();
        
        // Update display
        updateDisplay();
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'stopwatch');
            }
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        startBtn.addEventListener('click', startStopwatch);
        pauseBtn.addEventListener('click', pauseStopwatch);
        lapBtn.addEventListener('click', recordLap);
        resetBtn.addEventListener('click', resetStopwatch);
        
        // Settings
        displayFormatSelect.addEventListener('change', function() {
            updateDisplay();
            saveSettings();
        });
        
        stopwatchColorInput.addEventListener('change', function() {
            stopwatchDisplay.style.color = this.value;
            saveSettings();
        });
        
        autoLapCheckbox.addEventListener('change', function() {
            toggleAutoLap();
            saveSettings();
        });
        
        autoLapTimeInput.addEventListener('change', function() {
            if (autoLapCheckbox.checked && isRunning) {
                toggleAutoLap();
            }
            saveSettings();
        });
    }
    
    // Start the stopwatch
    function startStopwatch() {
        if (isRunning) return;
        
        isRunning = true;
        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
        lapBtn.classList.remove('hidden');
        
        if (elapsedTime === 0) {
            // First start
            startTime = Date.now();
            lastLapTime = startTime;
        } else {
            // Resume after pause
            startTime = Date.now() - elapsedTime;
        }
        
        timerInterval = setInterval(updateTime, 10); // Update every 10ms for smooth display
        
        // Start auto-lap if enabled
        if (autoLapCheckbox.checked) {
            toggleAutoLap();
        }
    }
    
    // Pause the stopwatch
    function pauseStopwatch() {
        if (!isRunning) return;
        
        isRunning = false;
        clearInterval(timerInterval);
        clearInterval(autoLapInterval);
        
        pauseBtn.classList.add('hidden');
        startBtn.classList.remove('hidden');
    }
    
    // Record a lap time
    function recordLap() {
        if (!isRunning) return;
        
        const currentTime = Date.now();
        const totalTime = currentTime - startTime;
        const lapTime = currentTime - lastLapTime;
        
        laps.push({
            number: laps.length + 1,
            lapTime: lapTime,
            totalTime: totalTime
        });
        
        lastLapTime = currentTime;
        
        updateLapTimes();
        lapTimesContainer.classList.remove('hidden');
    }
    
    // Reset the stopwatch
    function resetStopwatch() {
        pauseStopwatch();
        
        startTime = 0;
        elapsedTime = 0;
        laps = [];
        lastLapTime = 0;
        
        updateDisplay();
        lapTimesTable.innerHTML = '';
        lapTimesContainer.classList.add('hidden');
        elapsedTimeDisplay.classList.add('hidden');
        
        lapBtn.classList.add('hidden');
    }
    
    // Update the timer display
    function updateTime() {
        const currentTime = Date.now();
        elapsedTime = currentTime - startTime;
        
        updateDisplay();
    }
    
    // Update the stopwatch display
    function updateDisplay() {
        const time = formatTime(elapsedTime);
        stopwatchDisplay.textContent = time;
    }
    
    // Format time based on selected display format
    function formatTime(timeInMs) {
        const format = displayFormatSelect.value;
        
        const ms = Math.floor((timeInMs % 1000) / 10); // Centiseconds (1/100th of a second)
        const seconds = Math.floor((timeInMs / 1000) % 60);
        const minutes = Math.floor((timeInMs / (1000 * 60)) % 60);
        const hours = Math.floor(timeInMs / (1000 * 60 * 60));
        
        // Format with leading zeros
        const msStr = ms.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');
        const hoursStr = hours.toString().padStart(2, '0');
        
        // Return formatted time based on selected display format
        switch (format) {
            case 'seconds':
                const totalSeconds = hours * 3600 + minutes * 60 + seconds;
                return `${totalSeconds}.${msStr}`;
            case 'minutes':
                return `${minutesStr}:${secondsStr}.${msStr}`;
            case 'full':
            default:
                return `${hoursStr}:${minutesStr}:${secondsStr}.${msStr}`;
        }
    }
    
    // Update lap times display
    function updateLapTimes() {
        // Clear existing lap times
        lapTimesTable.innerHTML = '';
        
        // Add lap times in reverse order (newest first)
        for (let i = laps.length - 1; i >= 0; i--) {
            const lap = laps[i];
            const row = document.createElement('tr');
            
            // Lap number
            const lapNumberCell = document.createElement('td');
            lapNumberCell.className = 'py-2 px-4';
            lapNumberCell.textContent = lap.number;
            row.appendChild(lapNumberCell);
            
            // Lap time
            const lapTimeCell = document.createElement('td');
            lapTimeCell.className = 'py-2 px-4';
            lapTimeCell.textContent = formatTime(lap.lapTime);
            row.appendChild(lapTimeCell);
            
            // Total time
            const totalTimeCell = document.createElement('td');
            totalTimeCell.className = 'py-2 px-4';
            totalTimeCell.textContent = formatTime(lap.totalTime);
            row.appendChild(totalTimeCell);
            
            // Highlight fastest and slowest laps
            if (laps.length > 1) {
                if (lap.lapTime === Math.min(...laps.map(l => l.lapTime))) {
                    row.classList.add('bg-green-50');
                    lapTimeCell.classList.add('text-green-600', 'font-semibold');
                } else if (lap.lapTime === Math.max(...laps.map(l => l.lapTime))) {
                    row.classList.add('bg-red-50');
                    lapTimeCell.classList.add('text-red-600', 'font-semibold');
                }
            }
            
            lapTimesTable.appendChild(row);
        }
    }
    
    // Toggle auto-lap functionality
    function toggleAutoLap() {
        clearInterval(autoLapInterval);
        
        if (autoLapCheckbox.checked && isRunning) {
            const intervalSeconds = parseInt(autoLapTimeInput.value) || 30;
            autoLapInterval = setInterval(recordLap, intervalSeconds * 1000);
        }
    }
    
    // Save settings to localStorage
    function saveSettings() {
        const settings = {
            displayFormat: displayFormatSelect.value,
            stopwatchColor: stopwatchColorInput.value,
            autoLap: autoLapCheckbox.checked,
            autoLapTime: autoLapTimeInput.value
        };
        
        localStorage.setItem('stopwatchSettings', JSON.stringify(settings));
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('stopwatchSettings');
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            displayFormatSelect.value = settings.displayFormat || 'full';
            stopwatchColorInput.value = settings.stopwatchColor || '#4F46E5';
            autoLapCheckbox.checked = settings.autoLap || false;
            autoLapTimeInput.value = settings.autoLapTime || 30;
            
            // Apply color
            stopwatchDisplay.style.color = stopwatchColorInput.value;
        }
    }
    
    // Initialize the stopwatch
    initStopwatch();
});

// Add 3D icon definition for the stopwatch
if (typeof Tool3DIcon !== 'undefined') {
    Tool3DIcon.addIconDefinition('stopwatch', function(scene, container) {
        // Create a stopwatch 3D model
        const group = new THREE.Group();
        
        // Stopwatch body (circle)
        const bodyGeometry = new THREE.CircleGeometry(1, 32);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x6366F1,
            metalness: 0.3,
            roughness: 0.4
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);
        
        // Stopwatch rim
        const rimGeometry = new THREE.RingGeometry(0.9, 1, 32);
        const rimMaterial = new THREE.MeshStandardMaterial({
            color: 0xC7D2FE,
            metalness: 0.7,
            roughness: 0.2
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.position.z = 0.01;
        group.add(rim);
        
        // Stopwatch button
        const buttonGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
        const buttonMaterial = new THREE.MeshStandardMaterial({
            color: 0xEF4444,
            metalness: 0.5,
            roughness: 0.3
        });
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        button.position.set(0, 1.1, 0.1);
        button.rotation.x = Math.PI / 2;
        group.add(button);
        
        // Stopwatch hands
        const handGeometry = new THREE.PlaneGeometry(0.05, 0.8);
        const handMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            metalness: 0.1,
            roughness: 0.3
        });
        
        // Second hand
        const secondHand = new THREE.Mesh(handGeometry, handMaterial);
        secondHand.position.z = 0.02;
        secondHand.position.y = 0.4;
        group.add(secondHand);
        
        // Minute hand
        const minuteHandGeometry = new THREE.PlaneGeometry(0.04, 0.6);
        const minuteHand = new THREE.Mesh(minuteHandGeometry, handMaterial);
        minuteHand.position.z = 0.03;
        minuteHand.position.y = 0.3;
        minuteHand.rotation.z = Math.PI / 3;
        group.add(minuteHand);
        
        // Center pin
        const pinGeometry = new THREE.CircleGeometry(0.08, 16);
        const pinMaterial = new THREE.MeshStandardMaterial({
            color: 0xF59E0B,
            metalness: 0.7,
            roughness: 0.2
        });
        const pin = new THREE.Mesh(pinGeometry, pinMaterial);
        pin.position.z = 0.04;
        group.add(pin);
        
        // Animation
        const animate = () => {
            secondHand.rotation.z -= 0.03;
            minuteHand.rotation.z -= 0.005;
        };
        
        return { group, animate };
    });
}
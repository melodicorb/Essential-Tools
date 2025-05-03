/**
 * Pomodoro Timer - JavaScript functionality
 * Provides interactive timer with work and break intervals
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const timerDisplay = document.getElementById('timer-display');
    const timerLabel = document.getElementById('timer-label');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const workDurationInput = document.getElementById('work-duration');
    const shortBreakInput = document.getElementById('short-break');
    const longBreakInput = document.getElementById('long-break');
    const pomodoroCountInput = document.getElementById('pomodoro-count');
    const autoStartBreaksCheckbox = document.getElementById('auto-start-breaks');
    const autoStartPomodorosCheckbox = document.getElementById('auto-start-pomodoros');
    const enableNotificationsCheckbox = document.getElementById('enable-notifications');
    const completedPomodorosElement = document.getElementById('completed-pomodoros');
    
    // Timer state variables
    let timerInterval = null;
    let timeRemaining = 25 * 60; // Default: 25 minutes in seconds
    let isRunning = false;
    let currentMode = 'work'; // 'work', 'shortBreak', or 'longBreak'
    let completedPomodoros = 0;
    let totalPomodoros = 4; // Default: 4 pomodoros before long break
    
    // Initialize the timer
    function initTimer() {
        // Load saved settings if available
        loadSettings();
        
        // Update timer display
        updateTimerDisplay();
        updatePomodoroIndicators();
        
        // Set up event listeners
        setupEventListeners();
        
        // Request notification permission
        if ("Notification" in window) {
            Notification.requestPermission();
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);
        
        // Settings inputs
        workDurationInput.addEventListener('change', updateSettings);
        shortBreakInput.addEventListener('change', updateSettings);
        longBreakInput.addEventListener('change', updateSettings);
        pomodoroCountInput.addEventListener('change', updateSettings);
        autoStartBreaksCheckbox.addEventListener('change', saveSettings);
        autoStartPomodorosCheckbox.addEventListener('change', saveSettings);
        enableNotificationsCheckbox.addEventListener('change', saveSettings);
    }
    
    // Start the timer
    function startTimer() {
        if (isRunning) return;
        
        isRunning = true;
        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
        
        timerInterval = setInterval(function() {
            timeRemaining--;
            
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                timerComplete();
            }
            
            updateTimerDisplay();
        }, 1000);
    }
    
    // Pause the timer
    function pauseTimer() {
        if (!isRunning) return;
        
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
    }
    
    // Reset the timer
    function resetTimer() {
        pauseTimer();
        setTimerMode('work');
        completedPomodoros = 0;
        completedPomodorosElement.textContent = completedPomodoros;
        updatePomodoroIndicators();
    }
    
    // Timer completed
    function timerComplete() {
        isRunning = false;
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
        
        // Play sound
        playNotificationSound();
        
        // Show notification
        if (enableNotificationsCheckbox.checked && Notification.permission === "granted") {
            let notificationTitle, notificationBody;
            
            if (currentMode === 'work') {
                notificationTitle = "Work session complete!";
                notificationBody = "Time for a break.";
                completedPomodoros++;
                completedPomodorosElement.textContent = completedPomodoros;
                updatePomodoroIndicators();
                
                // Determine next break type
                if (completedPomodoros % totalPomodoros === 0) {
                    setTimerMode('longBreak');
                } else {
                    setTimerMode('shortBreak');
                }
                
                // Auto-start break if enabled
                if (autoStartBreaksCheckbox.checked) {
                    setTimeout(startTimer, 1000);
                }
            } else {
                notificationTitle = "Break complete!";
                notificationBody = "Time to get back to work.";
                setTimerMode('work');
                
                // Auto-start next pomodoro if enabled
                if (autoStartPomodorosCheckbox.checked) {
                    setTimeout(startTimer, 1000);
                }
            }
            
            new Notification(notificationTitle, {
                body: notificationBody,
                icon: "../images/pomodoro-icon.png"
            });
        } else {
            if (currentMode === 'work') {
                completedPomodoros++;
                completedPomodorosElement.textContent = completedPomodoros;
                updatePomodoroIndicators();
                
                // Determine next break type
                if (completedPomodoros % totalPomodoros === 0) {
                    setTimerMode('longBreak');
                } else {
                    setTimerMode('shortBreak');
                }
                
                // Auto-start break if enabled
                if (autoStartBreaksCheckbox.checked) {
                    setTimeout(startTimer, 1000);
                }
            } else {
                setTimerMode('work');
                
                // Auto-start next pomodoro if enabled
                if (autoStartPomodorosCheckbox.checked) {
                    setTimeout(startTimer, 1000);
                }
            }
        }
    }
    
    // Set timer mode (work, short break, long break)
    function setTimerMode(mode) {
        currentMode = mode;
        
        switch(mode) {
            case 'work':
                timeRemaining = parseInt(workDurationInput.value) * 60;
                timerLabel.textContent = 'WORK';
                timerLabel.className = 'text-xl font-semibold text-red-500';
                break;
            case 'shortBreak':
                timeRemaining = parseInt(shortBreakInput.value) * 60;
                timerLabel.textContent = 'SHORT BREAK';
                timerLabel.className = 'text-xl font-semibold text-green-500';
                break;
            case 'longBreak':
                timeRemaining = parseInt(longBreakInput.value) * 60;
                timerLabel.textContent = 'LONG BREAK';
                timerLabel.className = 'text-xl font-semibold text-blue-500';
                break;
        }
        
        updateTimerDisplay();
    }
    
    // Update timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update document title
        document.title = `${timerDisplay.textContent} - ${timerLabel.textContent} | Pomodoro Timer`;
    }
    
    // Update pomodoro indicators
    function updatePomodoroIndicators() {
        totalPomodoros = parseInt(pomodoroCountInput.value);
        
        // Create or update pomodoro indicators
        const indicatorsContainer = document.querySelector('.flex.justify-center.space-x-2.mb-4');
        indicatorsContainer.innerHTML = '';
        
        for (let i = 0; i < totalPomodoros; i++) {
            const indicator = document.createElement('div');
            indicator.id = `pomodoro-${i+1}`;
            indicator.className = 'w-6 h-6 rounded-full';
            
            // Set color based on completion status
            if (i < completedPomodoros) {
                indicator.classList.add('bg-red-500');
            } else {
                indicator.classList.add('bg-gray-200');
            }
            
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    // Play notification sound
    function playNotificationSound() {
        const audio = new Audio('../sounds/notification.mp3');
        audio.play().catch(error => console.log('Audio play failed:', error));
    }
    
    // Update settings
    function updateSettings() {
        // Validate inputs
        workDurationInput.value = Math.max(1, Math.min(60, workDurationInput.value));
        shortBreakInput.value = Math.max(1, Math.min(30, shortBreakInput.value));
        longBreakInput.value = Math.max(1, Math.min(60, longBreakInput.value));
        pomodoroCountInput.value = Math.max(1, Math.min(10, pomodoroCountInput.value));
        
        // Update timer if not running
        if (!isRunning) {
            setTimerMode(currentMode);
        }
        
        // Update pomodoro indicators
        updatePomodoroIndicators();
        
        // Save settings
        saveSettings();
    }
    
    // Save settings to local storage
    function saveSettings() {
        const settings = {
            workDuration: workDurationInput.value,
            shortBreak: shortBreakInput.value,
            longBreak: longBreakInput.value,
            pomodoroCount: pomodoroCountInput.value,
            autoStartBreaks: autoStartBreaksCheckbox.checked,
            autoStartPomodoros: autoStartPomodorosCheckbox.checked,
            enableNotifications: enableNotificationsCheckbox.checked
        };
        
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    }
    
    // Load settings from local storage
    function loadSettings() {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            workDurationInput.value = settings.workDuration || 25;
            shortBreakInput.value = settings.shortBreak || 5;
            longBreakInput.value = settings.longBreak || 15;
            pomodoroCountInput.value = settings.pomodoroCount || 4;
            autoStartBreaksCheckbox.checked = settings.autoStartBreaks || false;
            autoStartPomodorosCheckbox.checked = settings.autoStartPomodoros || false;
            enableNotificationsCheckbox.checked = settings.enableNotifications !== undefined ? settings.enableNotifications : true;
            
            totalPomodoros = parseInt(pomodoroCountInput.value);
            timeRemaining = parseInt(workDurationInput.value) * 60;
        }
    }
    
    // Initialize the timer
    initTimer();
});

// Add Pomodoro Timer 3D icon to the Tool3DIcon namespace
if (typeof Tool3DIcon !== 'undefined') {
    // Wait for Tool3DIcon to be defined
    document.addEventListener('DOMContentLoaded', function() {
        // Extend the createToolIcon function to include pomodoro-timer
        const originalCreateToolIcon = Tool3DIcon.createToolIcon;
        
        Tool3DIcon.createToolIcon = function(toolType) {
            if (toolType === 'pomodoro-timer') {
                // Create a pomodoro timer 3D icon
                const pomodoroGroup = new THREE.Group();
                
                // Timer base (tomato shape)
                const tomato = new THREE.Mesh(
                    new THREE.SphereGeometry(1, 32, 32),
                    new THREE.MeshStandardMaterial({ 
                        color: 0xE53E3E, // Red
                        metalness: 0.1,
                        roughness: 0.8
                    })
                );
                tomato.scale.set(1, 0.9, 1); // Slightly squash to look more like a tomato
                pomodoroGroup.add(tomato);
                
                // Tomato stem
                const stem = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x10B981, // Green
                        metalness: 0.1,
                        roughness: 0.8
                    })
                );
                stem.position.y = 0.9;
                pomodoroGroup.add(stem);
                
                // Tomato leaf
                const leaf = new THREE.Mesh(
                    new THREE.BoxGeometry(0.4, 0.05, 0.2),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x10B981, // Green
                        metalness: 0.1,
                        roughness: 0.8
                    })
                );
                leaf.position.set(0.2, 0.9, 0);
                leaf.rotation.z = Math.PI / 6;
                pomodoroGroup.add(leaf);
                
                // Timer face
                const timerFace = new THREE.Mesh(
                    new THREE.CircleGeometry(0.6, 32),
                    new THREE.MeshStandardMaterial({ 
                        color: 0xFFFFFF, // White
                        metalness: 0.1,
                        roughness: 0.8
                    })
                );
                timerFace.position.z = 0.9;
                pomodoroGroup.add(timerFace);
                
                // Timer markings
                for (let i = 0; i < 12; i++) {
                    const marking = new THREE.Mesh(
                        new THREE.BoxGeometry(0.03, 0.15, 0.01),
                        new THREE.MeshStandardMaterial({ 
                            color: 0x1F2937, // Dark gray
                            metalness: 0.1,
                            roughness: 0.9
                        })
                    );
                    const angle = (i * Math.PI / 6);
                    marking.position.set(
                        0.4 * Math.sin(angle),
                        0.4 * Math.cos(angle),
                        0.91
                    );
                    marking.rotation.z = angle;
                    pomodoroGroup.add(marking);
                }
                
                // Timer hands
                const hourHand = new THREE.Mesh(
                    new THREE.BoxGeometry(0.04, 0.3, 0.01),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x1F2937, // Dark gray
                        metalness: 0.1,
                        roughness: 0.9
                    })
                );
                hourHand.position.z = 0.92;
                hourHand.position.y = 0.15; // Offset to rotate around bottom
                pomodoroGroup.add(hourHand);
                
                const minuteHand = new THREE.Mesh(
                    new THREE.BoxGeometry(0.03, 0.4, 0.01),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x1F2937, // Dark gray
                        metalness: 0.1,
                        roughness: 0.9
                    })
                );
                minuteHand.position.z = 0.93;
                minuteHand.position.y = 0.2; // Offset to rotate around bottom
                pomodoroGroup.add(minuteHand);
                
                // Animate the clock hands
                const clockAnimation = () => {
                    const time = Date.now() * 0.001; // Convert to seconds
                    hourHand.rotation.z = time * 0.1;
                    minuteHand.rotation.z = time * 0.5;
                    requestAnimationFrame(clockAnimation);
                };
                clockAnimation();
                
                this.mesh = pomodoroGroup;
            } else {
                // Call the original function for other tool types
                originalCreateToolIcon.call(this, toolType);
            }
        };
        
        // Initialize 3D icon if container exists
        const container = document.querySelector('.tool-3d-container[data-tool-type="pomodoro-timer"]');
        if (container) {
            Tool3DIcon.init(container, 'pomodoro-timer');
        }
    });
}
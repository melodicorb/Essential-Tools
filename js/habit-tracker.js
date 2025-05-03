/**
 * Habit Tracker - JavaScript functionality
 * Provides habit tracking with streak counting and progress visualization
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const habitNameInput = document.getElementById('habit-name');
    const habitFrequencySelect = document.getElementById('habit-frequency');
    const customDaysContainer = document.getElementById('custom-days-container');
    const customDayCheckboxes = document.querySelectorAll('.custom-day');
    const addHabitBtn = document.getElementById('add-habit-btn');
    const habitsList = document.getElementById('habits-list');
    const noHabitsMessage = document.getElementById('no-habits-message');
    const habitStats = document.getElementById('habit-stats');
    const currentStreaksElement = document.getElementById('current-streaks');
    const completionRateElement = document.getElementById('completion-rate');
    const totalCheckinsElement = document.getElementById('total-checkins');
    const reminderTimeInput = document.getElementById('reminder-time');
    const themeColorInput = document.getElementById('theme-color');
    const showStreakAnimationCheckbox = document.getElementById('show-streak-animation');
    
    // State variables
    let habits = [];
    let settings = {
        reminderTime: '20:00',
        themeColor: '#4F46E5',
        showStreakAnimation: true
    };
    
    // Initialize the habit tracker
    function initHabitTracker() {
        // Load saved habits and settings if available
        loadFromLocalStorage();
        
        // Set up event listeners
        setupEventListeners();
        
        // Render habits list
        renderHabits();
        
        // Update stats
        updateStats();
        
        // Apply settings
        applySettings();
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'habit-tracker');
            }
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Add habit button
        addHabitBtn.addEventListener('click', addHabit);
        
        // Habit frequency change
        habitFrequencySelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customDaysContainer.classList.remove('hidden');
            } else {
                customDaysContainer.classList.add('hidden');
            }
        });
        
        // Settings changes
        reminderTimeInput.addEventListener('change', function() {
            settings.reminderTime = this.value;
            saveSettings();
            setupNotifications();
        });
        
        themeColorInput.addEventListener('change', function() {
            settings.themeColor = this.value;
            saveSettings();
            applySettings();
        });
        
        showStreakAnimationCheckbox.addEventListener('change', function() {
            settings.showStreakAnimation = this.checked;
            saveSettings();
        });
    }
    
    // Add a new habit
    function addHabit() {
        const habitName = habitNameInput.value.trim();
        if (!habitName) {
            alert('Please enter a habit name');
            return;
        }
        
        const frequency = habitFrequencySelect.value;
        let days = [];
        
        if (frequency === 'daily') {
            days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        } else if (frequency === 'weekly') {
            // Default to Monday for weekly habits
            days = ['mon'];
        } else if (frequency === 'custom') {
            // Get selected custom days
            customDayCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    days.push(checkbox.value);
                }
            });
            
            if (days.length === 0) {
                alert('Please select at least one day for your custom habit');
                return;
            }
        }
        
        // Create new habit object
        const newHabit = {
            id: Date.now().toString(),
            name: habitName,
            frequency: frequency,
            days: days,
            streak: 0,
            longestStreak: 0,
            history: [],
            createdAt: new Date().toISOString(),
            lastCompleted: null
        };
        
        // Add to habits array
        habits.push(newHabit);
        
        // Save to localStorage
        saveHabits();
        
        // Clear form
        habitNameInput.value = '';
        habitFrequencySelect.value = 'daily';
        customDaysContainer.classList.add('hidden');
        customDayCheckboxes.forEach(checkbox => checkbox.checked = false);
        
        // Render habits
        renderHabits();
        
        // Update stats
        updateStats();
    }
    
    // Render habits list
    function renderHabits() {
        // Clear current list
        habitsList.innerHTML = '';
        
        // Show/hide no habits message
        if (habits.length === 0) {
            noHabitsMessage.classList.remove('hidden');
            habitStats.classList.add('hidden');
            return;
        } else {
            noHabitsMessage.classList.add('hidden');
            habitStats.classList.remove('hidden');
        }
        
        // Get current date info
        const today = new Date();
        const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][today.getDay()];
        const dateString = today.toISOString().split('T')[0];
        
        // Render each habit
        habits.forEach(habit => {
            const habitElement = document.createElement('div');
            habitElement.className = 'p-4 bg-white rounded-lg shadow-sm border border-gray-200';
            habitElement.dataset.id = habit.id;
            
            // Check if habit is scheduled for today
            const isScheduledToday = habit.days.includes(dayOfWeek);
            const isCompletedToday = habit.history.some(entry => entry.date === dateString && entry.completed);
            
            // Create habit content
            habitElement.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="mr-3">
                            <input type="checkbox" id="habit-${habit.id}" class="habit-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                                ${isCompletedToday ? 'checked' : ''} ${!isScheduledToday ? 'disabled' : ''}>
                        </div>
                        <div>
                            <label for="habit-${habit.id}" class="text-lg font-medium text-gray-800 ${isCompletedToday ? 'line-through text-gray-500' : ''}">${habit.name}</label>
                            <div class="text-sm text-gray-500">
                                ${getFrequencyText(habit)}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="text-center">
                            <div class="text-xs text-gray-500">Streak</div>
                            <div class="text-lg font-semibold text-indigo-600">${habit.streak}</div>
                        </div>
                        <button class="delete-habit-btn text-red-500 hover:text-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            
            // Add event listeners
            const checkbox = habitElement.querySelector('.habit-checkbox');
            checkbox.addEventListener('change', function() {
                toggleHabitCompletion(habit.id, this.checked);
            });
            
            const deleteBtn = habitElement.querySelector('.delete-habit-btn');
            deleteBtn.addEventListener('click', function() {
                deleteHabit(habit.id);
            });
            
            habitsList.appendChild(habitElement);
        });
    }
    
    // Get frequency text for display
    function getFrequencyText(habit) {
        if (habit.frequency === 'daily') {
            return 'Every day';
        } else if (habit.frequency === 'weekly') {
            return 'Once a week';
        } else {
            // Format custom days
            const dayNames = {
                mon: 'Monday',
                tue: 'Tuesday',
                wed: 'Wednesday',
                thu: 'Thursday',
                fri: 'Friday',
                sat: 'Saturday',
                sun: 'Sunday'
            };
            
            return habit.days.map(day => dayNames[day].substring(0, 3)).join(', ');
        }
    }
    
    // Toggle habit completion
    function toggleHabitCompletion(habitId, completed) {
        const habitIndex = habits.findIndex(h => h.id === habitId);
        if (habitIndex === -1) return;
        
        const habit = habits[habitIndex];
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        
        // Find if there's an entry for today
        const todayEntryIndex = habit.history.findIndex(entry => entry.date === dateString);
        
        if (todayEntryIndex !== -1) {
            // Update existing entry
            habit.history[todayEntryIndex].completed = completed;
        } else {
            // Add new entry
            habit.history.push({
                date: dateString,
                completed: completed
            });
        }
        
        // Update streak
        updateStreak(habitIndex, completed);
        
        // Save changes
        saveHabits();
        
        // Re-render habits
        renderHabits();
        
        // Update stats
        updateStats();
        
        // Show streak animation if enabled and streak increased
        if (completed && settings.showStreakAnimation && habit.streak > 0 && habit.streak % 5 === 0) {
            showStreakCelebration(habit.streak);
        }
    }
    
    // Update streak for a habit
    function updateStreak(habitIndex, completedToday) {
        const habit = habits[habitIndex];
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];
        
        // Check if habit was completed yesterday or if it wasn't scheduled yesterday
        const yesterdayEntry = habit.history.find(entry => entry.date === yesterdayString);
        const dayOfWeekYesterday = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][yesterday.getDay()];
        const wasScheduledYesterday = habit.days.includes(dayOfWeekYesterday);
        
        if (completedToday) {
            // If completed today, check if streak continues or starts new
            if (!wasScheduledYesterday || (yesterdayEntry && yesterdayEntry.completed)) {
                // Continue streak
                habit.streak++;
            } else {
                // Start new streak
                habit.streak = 1;
            }
            
            // Update last completed date
            habit.lastCompleted = today.toISOString();
        } else {
            // If not completed today, reset streak
            habit.streak = 0;
        }
        
        // Update longest streak if current streak is longer
        if (habit.streak > habit.longestStreak) {
            habit.longestStreak = habit.streak;
        }
    }
    
    // Delete a habit
    function deleteHabit(habitId) {
        if (confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
            habits = habits.filter(habit => habit.id !== habitId);
            saveHabits();
            renderHabits();
            updateStats();
        }
    }
    
    // Update statistics
    function updateStats() {
        if (habits.length === 0) {
            currentStreaksElement.textContent = '0';
            completionRateElement.textContent = '0%';
            totalCheckinsElement.textContent = '0';
            return;
        }
        
        // Calculate current streaks (sum of all active streaks)
        const totalStreaks = habits.reduce((sum, habit) => sum + habit.streak, 0);
        currentStreaksElement.textContent = totalStreaks;
        
        // Calculate completion rate
        let totalCompletions = 0;
        let totalPossibleCompletions = 0;
        
        // Get last 30 days
        const today = new Date();
        const last30Days = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            last30Days.push(date.toISOString().split('T')[0]);
        }
        
        // Count completions for each habit in the last 30 days
        habits.forEach(habit => {
            last30Days.forEach(dateString => {
                const date = new Date(dateString);
                const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()];
                
                // Check if habit was scheduled for this day
                if (habit.days.includes(dayOfWeek)) {
                    totalPossibleCompletions++;
                    
                    // Check if habit was completed on this day
                    const entry = habit.history.find(e => e.date === dateString);
                    if (entry && entry.completed) {
                        totalCompletions++;
                    }
                }
            });
        });
        
        // Calculate completion rate
        const completionRate = totalPossibleCompletions > 0 
            ? Math.round((totalCompletions / totalPossibleCompletions) * 100) 
            : 0;
        completionRateElement.textContent = `${completionRate}%`;
        
        // Calculate total check-ins
        const totalCheckins = habits.reduce((sum, habit) => {
            return sum + habit.history.filter(entry => entry.completed).length;
        }, 0);
        totalCheckinsElement.textContent = totalCheckins;
    }
    
    // Show streak celebration animation
    function showStreakCelebration(streak) {
        // Create celebration element
        const celebration = document.createElement('div');
        celebration.className = 'fixed inset-0 flex items-center justify-center z-50 pointer-events-none';
        celebration.innerHTML = `
            <div class="bg-indigo-600 text-white px-6 py-4 rounded-lg shadow-lg text-center transform scale-0 transition-transform duration-500">
                <div class="text-2xl font-bold mb-2">🎉 ${streak} Day Streak! 🎉</div>
                <div>Keep up the great work!</div>
            </div>
        `;
        
        document.body.appendChild(celebration);
        
        // Animate in
        setTimeout(() => {
            const inner = celebration.querySelector('div');
            inner.classList.remove('scale-0');
            inner.classList.add('scale-100');
        }, 100);
        
        // Remove after animation
        setTimeout(() => {
            const inner = celebration.querySelector('div');
            inner.classList.remove('scale-100');
            inner.classList.add('scale-0');
            
            setTimeout(() => {
                document.body.removeChild(celebration);
            }, 500);
        }, 3000);
    }
    
    // Set up browser notifications
    function setupNotifications() {
        // Check if notifications are supported and permission is granted
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return;
        }
        
        // Request permission if needed
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
        
        // Set up daily reminder
        const reminderTime = settings.reminderTime.split(':');
        const hours = parseInt(reminderTime[0]);
        const minutes = parseInt(reminderTime[1]);
        
        // Calculate time until reminder
        const now = new Date();
        const reminderDate = new Date(now);
        reminderDate.setHours(hours, minutes, 0, 0);
        
        // If reminder time has passed for today, set for tomorrow
        if (reminderDate <= now) {
            reminderDate.setDate(reminderDate.getDate() + 1);
        }
        
        // Calculate milliseconds until reminder
        const timeUntilReminder = reminderDate.getTime() - now.getTime();
        
        // Set timeout for reminder
        setTimeout(() => {
            showNotification();
            // Set up next reminder for tomorrow
            setupNotifications();
        }, timeUntilReminder);
    }
    
    // Show notification
    function showNotification() {
        if (Notification.permission === 'granted') {
            // Get habits scheduled for today
            const today = new Date();
            const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][today.getDay()];
            const todaysHabits = habits.filter(habit => habit.days.includes(dayOfWeek));
            
            if (todaysHabits.length > 0) {
                const notification = new Notification('Habit Tracker Reminder', {
                    body: `You have ${todaysHabits.length} habits scheduled for today. Don't forget to check them off!`,
                    icon: '/favicon.ico'
                });
                
                notification.onclick = function() {
                    window.focus();
                    this.close();
                };
            }
        }
    }
    
    // Apply settings to UI
    function applySettings() {
        // Set input values
        reminderTimeInput.value = settings.reminderTime;
        themeColorInput.value = settings.themeColor;
        showStreakAnimationCheckbox.checked = settings.showStreakAnimation;
        
        // Apply theme color to UI elements
        document.querySelectorAll('.bg-indigo-600').forEach(el => {
            el.style.backgroundColor = settings.themeColor;
        });
        
        document.querySelectorAll('.text-indigo-600').forEach(el => {
            el.style.color = settings.themeColor;
        });
    }
    
    // Save habits to localStorage
    function saveHabits() {
        localStorage.setItem('habits', JSON.stringify(habits));
    }
    
    // Save settings to localStorage
    function saveSettings() {
        localStorage.setItem('habitTrackerSettings', JSON.stringify(settings));
    }
    
    // Load from localStorage
    function loadFromLocalStorage() {
        // Load habits
        const savedHabits = localStorage.getItem('habits');
        if (savedHabits) {
            habits = JSON.parse(savedHabits);
        }
        
        // Load settings
        const savedSettings = localStorage.getItem('habitTrackerSettings');
        if (savedSettings) {
            settings = {...settings, ...JSON.parse(savedSettings)};
        }
    }
    
    // Initialize the habit tracker
    initHabitTracker();
});

// Add 3D icon definition for the habit tracker
if (typeof Tool3DIcon !== 'undefined') {
    Tool3DIcon.addIconDefinition('habit-tracker', function(scene, container) {
        // Create a habit tracker 3D model
        const group = new THREE.Group();
        
        // Calendar base
        const calendarGeometry = new THREE.BoxGeometry(1.8, 0.2, 2);
        const calendarMaterial = new THREE.MeshStandardMaterial({
            color: 0xF3F4F6,
            metalness: 0.1,
            roughness: 0.8
        });
        const calendar = new THREE.Mesh(calendarGeometry, calendarMaterial);
        calendar.position.y = -0.5;
        group.add(calendar);
        
        // Calendar top (days display)
        const topGeometry = new THREE.BoxGeometry(1.8, 0.05, 0.5);
        const topMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B5CF6,
            metalness: 0.3,
            roughness: 0.6
        });
        const calendarTop = new THREE.Mesh(topGeometry, topMaterial);
        calendarTop.position.set(0, -0.375, -0.75);
        group.add(calendarTop);
        
        // Create calendar grid (5x7 for a month view)
        const cellSize = 0.2;
        const gridWidth = 7 * cellSize;
        const gridHeight = 5 * cellSize;
        
        // Grid container
        const gridGeometry = new THREE.PlaneGeometry(gridWidth, gridHeight);
        const gridMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            metalness: 0.1,
            roughness: 0.8
        });
        const grid = new THREE.Mesh(gridGeometry, gridMaterial);
        grid.position.set(0, -0.39, 0);
        grid.rotation.x = -Math.PI / 2;
        group.add(grid);
        
        // Create grid cells
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 7; col++) {
                // Cell background
                const cellGeometry = new THREE.PlaneGeometry(cellSize * 0.9, cellSize * 0.9);
                const cellMaterial = new THREE.MeshStandardMaterial({
                    color: 0xF9FAFB,
                    metalness: 0.1,
                    roughness: 0.8
                });
                const cell = new THREE.Mesh(cellGeometry, cellMaterial);
                
                // Position cell in grid
                const x = (col - 3) * cellSize;
                const z = (row - 2) * cellSize;
                cell.position.set(x, -0.38, z);
                cell.rotation.x = -Math.PI / 2;
                group.add(cell);
                
                // Add checkmarks to some cells randomly
                if (Math.random() > 0.6) {
                    const checkGeometry = new THREE.PlaneGeometry(cellSize * 0.5, cellSize * 0.5);
                    const checkMaterial = new THREE.MeshStandardMaterial({
                        color: 0x10B981,
                        metalness: 0.3,
                        roughness: 0.6,
                        transparent: true,
                        opacity: 0.9
                    });
                    const check = new THREE.Mesh(checkGeometry, checkMaterial);
                    check.position.set(x, -0.37, z);
                    check.rotation.x = -Math.PI / 2;
                    group.add(check);
                }
            }
        }
        
        // Add a pencil/marker
        const pencilGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
        const pencilMaterial = new THREE.MeshStandardMaterial({
            color: 0xEF4444,
            metalness: 0.3,
            roughness: 0.6
        });
        const pencil = new THREE.Mesh(pencilGeometry, pencilMaterial);
        pencil.position.set(0.8, 0, 0.8);
        pencil.rotation.x = Math.PI / 4;
        pencil.rotation.z = Math.PI / 6;
        group.add(pencil);
        
        // Pencil tip
        const tipGeometry = new THREE.ConeGeometry(0.05, 0.1, 16);
        const tipMaterial = new THREE.MeshStandardMaterial({
            color: 0x1F2937,
            metalness: 0.5,
            roughness: 0.5
        });
        const tip = new THREE.Mesh(tipGeometry, tipMaterial);
        tip.position.set(0.8 + Math.sin(Math.PI / 6) * 0.55, 0 + Math.cos(Math.PI / 4) * 0.55, 0.8 - Math.sin(Math.PI / 4) * 0.55);
        tip.rotation.x = Math.PI / 4;
        tip.rotation.z = Math.PI / 6;
        group.add(tip);
        
        // Animation
        let time = 0;
        const animate = () => {
            time += 0.01;
            group.rotation.y = Math.sin(time * 0.5) * 0.1;
            pencil.position.y = Math.sin(time) * 0.05;
            tip.position.y = Math.sin(time) * 0.05;
        };
        
        return { group, animate };
    });
}
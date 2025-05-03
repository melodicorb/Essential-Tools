/**
 * Typing Test - JavaScript functionality
 * Measures typing speed and accuracy with various text options
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const testDurationSelect = document.getElementById('test-duration');
    const textTypeSelect = document.getElementById('text-type');
    const timerDisplay = document.getElementById('timer-display');
    const textDisplay = document.getElementById('text-display');
    const typingInputContainer = document.getElementById('typing-input-container');
    const typingInput = document.getElementById('typing-input');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultsDisplay = document.getElementById('results-display');
    const wpmResult = document.getElementById('wpm-result');
    const accuracyResult = document.getElementById('accuracy-result');
    const cpmResult = document.getElementById('cpm-result');
    const shareResults = document.getElementById('share-results');
    const shareBtn = document.getElementById('share-btn');
    
    // Test state variables
    let testActive = false;
    let testStartTime = 0;
    let testEndTime = 0;
    let testDuration = 60; // Default: 1 minute
    let timerInterval = null;
    let currentText = '';
    let correctChars = 0;
    let incorrectChars = 0;
    let totalChars = 0;
    let currentPosition = 0;
    
    // Sample texts for different categories
    const sampleTexts = {
        common: [
            "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet. Isn't that interesting? The sentence is often used to test typewriters or keyboards because it includes all the letters.",
            "She sells seashells by the seashore. The shells she sells are surely seashells. So if she sells shells on the seashore, I'm sure she sells seashore shells.",
            "How vexingly quick daft zebras jump! Pack my box with five dozen liquor jugs. Amazingly few discotheques provide jukeboxes. Sphinx of black quartz, judge my vow."
        ],
        quotes: [
            "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
            "The way to get started is to quit talking and begin doing. - Walt Disney",
            "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking. - Steve Jobs"
        ],
        code: [
            "function calculateSum(arr) {\n  return arr.reduce((total, num) => total + num, 0);\n}\n\nconst numbers = [1, 2, 3, 4, 5];\nconst sum = calculateSum(numbers);\nconsole.log(sum); // Output: 15",
            "const fetchData = async () => {\n  try {\n    const response = await fetch('https://api.example.com/data');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error fetching data:', error);\n  }\n};",
            "class Person {\n  constructor(name, age) {\n    this.name = name;\n    this.age = age;\n  }\n\n  greet() {\n    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;\n  }\n}\n\nconst john = new Person('John', 30);\nconsole.log(john.greet());"
        ]
    };
    
    // Initialize the Typing Test
    function initTypingTest() {
        // Set up event listeners
        setupEventListeners();
        
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'typing-test');
            }
        }
        
        // Initialize mobile menu
        initMobileMenu();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Start button click
        startBtn.addEventListener('click', startTest);
        
        // Reset button click
        resetBtn.addEventListener('click', resetTest);
        
        // Typing input events
        typingInput.addEventListener('input', handleTyping);
        
        // Test duration change
        testDurationSelect.addEventListener('change', function() {
            testDuration = parseInt(this.value);
            updateTimerDisplay(testDuration);
        });
        
        // Text type change
        textTypeSelect.addEventListener('change', function() {
            if (!testActive) {
                selectRandomText();
            }
        });
        
        // Share button click
        shareBtn.addEventListener('click', shareTestResults);
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
    
    // Start the typing test
    function startTest() {
        if (testActive) return;
        
        // Reset previous test data
        correctChars = 0;
        incorrectChars = 0;
        totalChars = 0;
        currentPosition = 0;
        
        // Update UI
        startBtn.classList.add('hidden');
        resetBtn.classList.remove('hidden');
        timerDisplay.classList.remove('hidden');
        typingInputContainer.classList.remove('hidden');
        resultsDisplay.classList.add('hidden');
        shareResults.classList.add('hidden');
        
        // Select random text and display it
        selectRandomText();
        
        // Enable typing input
        typingInput.disabled = false;
        typingInput.value = '';
        typingInput.focus();
        
        // Set test duration
        testDuration = parseInt(testDurationSelect.value);
        updateTimerDisplay(testDuration);
        
        // Start the timer
        testActive = true;
        testStartTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    // Select a random text based on the selected type
    function selectRandomText() {
        const textType = textTypeSelect.value;
        const texts = sampleTexts[textType];
        const randomIndex = Math.floor(Math.random() * texts.length);
        currentText = texts[randomIndex];
        
        // Display the text
        displayText();
    }
    
    // Display the text with highlighting for current position
    function displayText() {
        let formattedText = '';
        
        for (let i = 0; i < currentText.length; i++) {
            if (i < currentPosition) {
                // Typed correctly
                if (i < typingInput.value.length && typingInput.value[i] === currentText[i]) {
                    formattedText += `<span class="text-green-600">${escapeHtml(currentText[i])}</span>`;
                } 
                // Typed incorrectly
                else {
                    formattedText += `<span class="text-red-600">${escapeHtml(currentText[i])}</span>`;
                }
            } 
            // Current position
            else if (i === currentPosition) {
                formattedText += `<span class="bg-primary text-white">${escapeHtml(currentText[i])}</span>`;
            } 
            // Not yet typed
            else {
                formattedText += escapeHtml(currentText[i]);
            }
        }
        
        textDisplay.innerHTML = formattedText;
    }
    
    // Handle typing input
    function handleTyping() {
        if (!testActive) return;
        
        const typedText = typingInput.value;
        currentPosition = typedText.length;
        
        // Count correct and incorrect characters
        correctChars = 0;
        incorrectChars = 0;
        
        for (let i = 0; i < typedText.length; i++) {
            if (i < currentText.length) {
                if (typedText[i] === currentText[i]) {
                    correctChars++;
                } else {
                    incorrectChars++;
                }
            } else {
                incorrectChars++;
            }
        }
        
        totalChars = correctChars + incorrectChars;
        
        // Update text display with highlighting
        displayText();
        
        // Check if the test is complete (all text typed)
        if (typedText.length >= currentText.length) {
            endTest();
        }
    }
    
    // Update the timer display
    function updateTimer() {
        const elapsedTime = Math.floor((Date.now() - testStartTime) / 1000);
        const remainingTime = testDuration - elapsedTime;
        
        if (remainingTime <= 0) {
            endTest();
        } else {
            updateTimerDisplay(remainingTime);
        }
    }
    
    // Update the timer display with the given time in seconds
    function updateTimerDisplay(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // End the typing test
    function endTest() {
        testActive = false;
        testEndTime = Date.now();
        clearInterval(timerInterval);
        
        // Disable typing input
        typingInput.disabled = true;
        
        // Calculate results
        calculateResults();
        
        // Show results
        resultsDisplay.classList.remove('hidden');
        shareResults.classList.remove('hidden');
    }
    
    // Reset the typing test
    function resetTest() {
        testActive = false;
        clearInterval(timerInterval);
        
        // Reset UI
        startBtn.classList.remove('hidden');
        resetBtn.classList.add('hidden');
        timerDisplay.classList.add('hidden');
        typingInputContainer.classList.add('hidden');
        resultsDisplay.classList.add('hidden');
        shareResults.classList.add('hidden');
        
        // Reset text display
        textDisplay.innerHTML = '<p class="text-center text-gray-500">Click "Start Test" to begin typing...</p>';
        
        // Reset input
        typingInput.value = '';
        typingInput.disabled = true;
        
        // Reset test duration display
        updateTimerDisplay(parseInt(testDurationSelect.value));
    }
    
    // Calculate test results
    function calculateResults() {
        const testTimeInMinutes = (testEndTime - testStartTime) / 60000; // Convert ms to minutes
        
        // Calculate WPM (Words Per Minute)
        // Standard: 5 characters = 1 word
        const wpm = Math.round(correctChars / 5 / testTimeInMinutes);
        
        // Calculate accuracy
        const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
        
        // Calculate CPM (Characters Per Minute)
        const cpm = Math.round(correctChars / testTimeInMinutes);
        
        // Update results display
        wpmResult.textContent = wpm;
        accuracyResult.textContent = `${accuracy}%`;
        cpmResult.textContent = cpm;
    }
    
    // Share test results
    function shareTestResults() {
        const wpm = wpmResult.textContent;
        const accuracy = accuracyResult.textContent;
        const shareText = `I just scored ${wpm} WPM with ${accuracy} accuracy on the Essential Tools Typing Test! Try to beat my score: https://essentialtools.com/tools/typing-test.html`;
        
        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share({
                title: 'My Typing Test Results',
                text: shareText,
                url: 'https://essentialtools.com/tools/typing-test.html'
            })
            .catch(error => console.error('Error sharing:', error));
        } else {
            // Fallback: copy to clipboard
            copyToClipboard(shareText);
            alert('Results copied to clipboard!');
        }
    }
    
    // Copy text to clipboard
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
    // Escape HTML special characters
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
    
    // Initialize the tool
    initTypingTest();
});

// Add Typing Test 3D Icon to Tool3DIcon object
if (typeof Tool3DIcon !== 'undefined') {
    Tool3DIcon.createTypingTestIcon = function(scene, colors) {
        const group = new THREE.Group();
        
        // Create a keyboard base
        const keyboardBase = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 0.2, 1.5),
            new THREE.MeshStandardMaterial({ 
                color: 0x333333, // Dark gray
                metalness: 0.3,
                roughness: 0.7
            })
        );
        keyboardBase.position.y = -0.1;
        group.add(keyboardBase);
        
        // Create keyboard keys
        const createKey = (x, y, z, width = 0.2, height = 0.2, depth = 0.1, color = 0xFFFFFF) => {
            const key = new THREE.Mesh(
                new THREE.BoxGeometry(width, height, depth),
                new THREE.MeshStandardMaterial({ 
                    color: color,
                    metalness: 0.1,
                    roughness: 0.5
                })
            );
            key.position.set(x, y, z);
            return key;
        };
        
        // Create a grid of keys
        const keySpacing = 0.25;
        const keyRows = 4;
        const keyCols = 10;
        const startX = -((keyCols - 1) * keySpacing) / 2;
        const startZ = -((keyRows - 1) * keySpacing) / 2;
        
        for (let row = 0; row < keyRows; row++) {
            for (let col = 0; col < keyCols; col++) {
                // Skip some keys to create a more realistic keyboard shape
                if ((row === 3 && col > 1 && col < 8)) {
                    // This is the space bar
                    if (col === 4) {
                        const spaceBar = createKey(
                            startX + 4 * keySpacing,
                            0.1,
                            startZ + 3 * keySpacing,
                            1.0, // Wider
                            0.1, // Thinner
                            0.25, // Deeper
                            0xE0E0E0 // Light gray
                        );
                        group.add(spaceBar);
                    }
                    continue;
                }
                
                // Determine key color - make some keys special colors
                let keyColor = 0xFFFFFF; // Default white
                
                // Enter key (red)
                if (row === 2 && col === 9) {
                    keyColor = 0xF87171; // Red
                }
                // Shift keys (blue)
                else if (row === 3 && (col === 0 || col === 9)) {
                    keyColor = 0x60A5FA; // Blue
                }
                // Tab key (green)
                else if (row === 1 && col === 0) {
                    keyColor = 0x34D399; // Green
                }
                // Random highlight keys (purple)
                else if ((row === 0 && col === 5) || (row === 2 && col === 3)) {
                    keyColor = 0xA78BFA; // Purple
                }
                
                const key = createKey(
                    startX + col * keySpacing,
                    0.1,
                    startZ + row * keySpacing,
                    0.2,
                    0.1,
                    0.2,
                    keyColor
                );
                
                group.add(key);
            }
        }
        
        // Add a small screen above the keyboard
        const screen = new THREE.Mesh(
            new THREE.BoxGeometry(2.0, 0.1, 0.8),
            new THREE.MeshStandardMaterial({ 
                color: 0x1E40AF, // Dark blue
                metalness: 0.2,
                roughness: 0.3,
                emissive: 0x1E40AF,
                emissiveIntensity: 0.2
            })
        );
        screen.position.set(0, 0.1, -0.8);
        group.add(screen);
        
        // Add text display on the screen
        const textDisplay = new THREE.Mesh(
            new THREE.PlaneGeometry(1.8, 0.6),
            new THREE.MeshBasicMaterial({ 
                color: 0xE0F2FE, // Light blue
                side: THREE.DoubleSide
            })
        );
        textDisplay.position.set(0, 0.16, -0.8);
        textDisplay.rotation.x = -Math.PI / 2;
        group.add(textDisplay);
        
        // Add typing cursor
        const cursor = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.05, 0.05),
            new THREE.MeshBasicMaterial({ color: 0x000000 })
        );
        cursor.position.set(0.2, 0.17, -0.8);
        group.add(cursor);
        
        // Animate the cursor blinking
        const animateCursor = () => {
            cursor.visible = !cursor.visible;
            setTimeout(animateCursor, 500);
        };
        animateCursor();
        
        scene.add(group);
        return group;
    };
}
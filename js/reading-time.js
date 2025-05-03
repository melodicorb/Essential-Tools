/**
 * Reading Time Calculator - JavaScript functionality
 * Estimates how long it takes to read text content with customizable reading speeds
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const textInput = document.getElementById('text-input');
    const wordCount = document.getElementById('word-count');
    const characterCount = document.getElementById('character-count');
    const paragraphCount = document.getElementById('paragraph-count');
    const readingTime = document.getElementById('reading-time');
    const detailedResults = document.getElementById('detailed-results');
    const resultPlaceholder = document.getElementById('result-placeholder');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const autoCalculate = document.getElementById('auto-calculate');
    const customSpeedRadio = document.getElementById('custom-speed');
    const customSpeedValue = document.getElementById('custom-speed-value');
    
    // Reading speed radio buttons
    const speedOptions = document.querySelectorAll('input[name="reading-speed"]');
    
    // Initialize the Reading Time Calculator
    function initReadingTimeCalculator() {
        // Set up event listeners
        setupEventListeners();
        
        // Set current year in footer
        if (document.getElementById('current-year')) {
            document.getElementById('current-year').textContent = new Date().getFullYear();
        }
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'reading-time');
            }
        }
        
        // Initialize mobile menu
        initMobileMenu();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Text input event
        textInput.addEventListener('input', function() {
            if (autoCalculate.checked) {
                calculateReadingTime();
            }
        });
        
        // Calculate button click
        calculateBtn.addEventListener('click', calculateReadingTime);
        
        // Clear button click
        clearBtn.addEventListener('click', function() {
            textInput.value = '';
            calculateReadingTime();
            textInput.focus();
        });
        
        // Copy button click
        copyBtn.addEventListener('click', function() {
            textInput.select();
            document.execCommand('copy');
            
            // Show feedback
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 1500);
        });
        
        // Reading speed options
        speedOptions.forEach(option => {
            option.addEventListener('change', function() {
                // Enable/disable custom speed input
                if (this.value === 'custom') {
                    customSpeedValue.disabled = false;
                    customSpeedValue.focus();
                } else {
                    customSpeedValue.disabled = true;
                }
                
                // Recalculate if auto-calculate is enabled
                if (autoCalculate.checked) {
                    calculateReadingTime();
                }
            });
        });
        
        // Custom speed value change
        customSpeedValue.addEventListener('input', function() {
            if (customSpeedRadio.checked && autoCalculate.checked) {
                calculateReadingTime();
            }
        });
        
        // Auto calculate checkbox
        autoCalculate.addEventListener('change', function() {
            if (this.checked) {
                calculateReadingTime();
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
    
    // Calculate reading time based on text and selected reading speed
    function calculateReadingTime() {
        const text = textInput.value;
        
        // Count words
        const words = text.trim() === '' ? [] : text.trim().split(/\s+/);
        wordCount.textContent = words.length;
        
        // Count characters
        characterCount.textContent = text.length;
        
        // Count paragraphs
        const paragraphs = text.trim() === '' ? [] : text.split(/\n+/).filter(paragraph => paragraph.trim() !== '');
        paragraphCount.textContent = paragraphs.length;
        
        // Get selected reading speed
        let readingSpeed = 225; // Default to average
        const selectedSpeed = document.querySelector('input[name="reading-speed"]:checked');
        
        if (selectedSpeed.value === 'custom') {
            readingSpeed = parseInt(customSpeedValue.value) || 225;
            if (readingSpeed < 1) {
                readingSpeed = 225;
                customSpeedValue.value = 225;
            }
        } else {
            readingSpeed = parseInt(selectedSpeed.value);
        }
        
        // Calculate reading time in minutes
        const readingMinutes = words.length / readingSpeed;
        
        // Format reading time display
        if (words.length === 0) {
            readingTime.textContent = '0 min';
        } else if (readingMinutes < 1) {
            const seconds = Math.ceil(readingMinutes * 60);
            readingTime.textContent = `${seconds} sec`;
        } else {
            const minutes = Math.floor(readingMinutes);
            const seconds = Math.ceil((readingMinutes - minutes) * 60);
            
            if (seconds === 0) {
                readingTime.textContent = `${minutes} min`;
            } else {
                readingTime.textContent = `${minutes} min ${seconds} sec`;
            }
        }
        
        // Update detailed results
        updateDetailedResults(words.length, readingSpeed, readingMinutes);
    }
    
    // Update detailed reading time breakdown
    function updateDetailedResults(wordCount, readingSpeed, readingMinutes) {
        // Clear previous results
        if (resultPlaceholder) {
            resultPlaceholder.style.display = wordCount > 0 ? 'none' : 'block';
        }
        
        // If no words, don't show detailed results
        if (wordCount === 0) {
            detailedResults.innerHTML = '<li id="result-placeholder" class="italic text-gray-500">Enter text to see detailed reading time breakdown</li>';
            return;
        }
        
        // Create detailed breakdown
        let html = '';
        
        // Basic reading time info
        const minutes = Math.floor(readingMinutes);
        const seconds = Math.ceil((readingMinutes - minutes) * 60);
        const timeText = minutes > 0 ? 
            `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds > 0 ? `${seconds} second${seconds !== 1 ? 's' : ''}` : ''}` : 
            `${seconds} second${seconds !== 1 ? 's' : ''}`;
        
        html += `<li><strong>Total Reading Time:</strong> ${timeText} at ${readingSpeed} words per minute</li>`;
        
        // Add reading time for different speeds if not already selected
        const speeds = [
            { name: 'Slow Reader (150 wpm)', wpm: 150 },
            { name: 'Average Reader (225 wpm)', wpm: 225 },
            { name: 'Fast Reader (300 wpm)', wpm: 300 }
        ];
        
        speeds.forEach(speed => {
            if (speed.wpm !== readingSpeed) {
                const speedMinutes = wordCount / speed.wpm;
                const speedMin = Math.floor(speedMinutes);
                const speedSec = Math.ceil((speedMinutes - speedMin) * 60);
                const speedTimeText = speedMin > 0 ? 
                    `${speedMin} minute${speedMin !== 1 ? 's' : ''} ${speedSec > 0 ? `${speedSec} second${speedSec !== 1 ? 's' : ''}` : ''}` : 
                    `${speedSec} second${speedSec !== 1 ? 's' : ''}`;
                
                html += `<li><strong>${speed.name}:</strong> ${speedTimeText}</li>`;
            }
        });
        
        // Add additional information
        const averageWordsPerPage = 250;
        const pages = Math.ceil(wordCount / averageWordsPerPage);
        html += `<li><strong>Approximate Pages:</strong> ${pages} (based on average of 250 words per page)</li>`;
        
        // Add speaking time (slower than reading)
        const speakingWpm = 150; // Average speaking rate
        const speakingMinutes = wordCount / speakingWpm;
        const speakMin = Math.floor(speakingMinutes);
        const speakSec = Math.ceil((speakingMinutes - speakMin) * 60);
        const speakTimeText = speakMin > 0 ? 
            `${speakMin} minute${speakMin !== 1 ? 's' : ''} ${speakSec > 0 ? `${speakSec} second${speakSec !== 1 ? 's' : ''}` : ''}` : 
            `${speakSec} second${speakSec !== 1 ? 's' : ''}`;
        
        html += `<li><strong>Speaking Time:</strong> ${speakTimeText} (if read aloud)</li>`;
        
        // Update the detailed results container
        detailedResults.innerHTML = html;
    }
    
    // Initialize the tool
    initReadingTimeCalculator();
});
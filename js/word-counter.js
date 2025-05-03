/**
 * Word Counter Tool - JavaScript functionality
 * Count words, characters, sentences, and paragraphs in your text
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const textInput = document.getElementById('text-input');
    const wordCount = document.getElementById('word-count');
    const characterCount = document.getElementById('character-count');
    const sentenceCount = document.getElementById('sentence-count');
    const paragraphCount = document.getElementById('paragraph-count');
    const readingTime = document.getElementById('reading-time');
    const speakingTime = document.getElementById('speaking-time');
    const keywordDensity = document.getElementById('keyword-density');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const excludeSpaces = document.getElementById('exclude-spaces');
    const excludeSpecialChars = document.getElementById('exclude-special-chars');
    
    // Initialize the word counter tool
    function initWordCounter() {
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
                Tool3DIcon.init(container, 'word-counter');
            }
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Text input event
        textInput.addEventListener('input', analyzeText);
        
        // Clear button
        clearBtn.addEventListener('click', function() {
            textInput.value = '';
            analyzeText();
            textInput.focus();
        });
        
        // Copy button
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
        
        // Checkbox events
        excludeSpaces.addEventListener('change', analyzeText);
        excludeSpecialChars.addEventListener('change', analyzeText);
        
        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
    
    // Analyze text and update statistics
    function analyzeText() {
        const text = textInput.value;
        
        // Count words
        const words = text.trim() === '' ? [] : text.trim().split(/\s+/);
        wordCount.textContent = words.length;
        
        // Count characters
        let chars = text.length;
        if (excludeSpaces.checked) {
            chars = text.replace(/\s/g, '').length;
        }
        if (excludeSpecialChars.checked) {
            chars = text.replace(/[^a-zA-Z0-9\s]/g, '').length;
            if (excludeSpaces.checked) {
                chars = text.replace(/[^a-zA-Z0-9]/g, '').length;
            }
        }
        characterCount.textContent = chars;
        
        // Count sentences
        const sentences = text.trim() === '' ? [] : text.split(/[.!?]+/).filter(sentence => sentence.trim() !== '');
        sentenceCount.textContent = sentences.length;
        
        // Count paragraphs
        const paragraphs = text.trim() === '' ? [] : text.split(/\n+/).filter(paragraph => paragraph.trim() !== '');
        paragraphCount.textContent = paragraphs.length;
        
        // Calculate reading time (average reading speed: 225 words per minute)
        const readingMinutes = words.length / 225;
        if (readingMinutes < 1) {
            const readingSeconds = Math.ceil(readingMinutes * 60);
            readingTime.textContent = `${readingSeconds} seconds`;
        } else {
            const minutes = Math.floor(readingMinutes);
            const seconds = Math.ceil((readingMinutes - minutes) * 60);
            readingTime.textContent = `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds > 0 ? `${seconds} seconds` : ''}`;
        }
        
        // Calculate speaking time (average speaking speed: 150 words per minute)
        const speakingMinutes = words.length / 150;
        if (speakingMinutes < 1) {
            const speakingSeconds = Math.ceil(speakingMinutes * 60);
            speakingTime.textContent = `${speakingSeconds} seconds`;
        } else {
            const minutes = Math.floor(speakingMinutes);
            const seconds = Math.ceil((speakingMinutes - minutes) * 60);
            speakingTime.textContent = `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds > 0 ? `${seconds} seconds` : ''}`;
        }
        
        // Calculate keyword density
        calculateKeywordDensity(words);
    }
    
    // Calculate and display keyword density
    function calculateKeywordDensity(words) {
        if (words.length === 0) {
            keywordDensity.innerHTML = '<p class="italic">Enter text to see keyword density</p>';
            return;
        }
        
        // Convert all words to lowercase and remove common words
        const commonWords = ['the', 'and', 'a', 'to', 'of', 'in', 'is', 'it', 'that', 'for', 'on', 'with', 'as', 'by', 'at', 'from', 'be', 'this', 'an', 'are', 'was', 'were', 'has', 'have', 'had', 'but', 'or', 'not', 'what', 'all', 'when', 'we', 'who', 'which', 'you', 'your', 'can', 'will', 'if', 'they', 'them', 'their', 'there', 'here', 'how', 'my', 'i', 'me', 'he', 'she', 'his', 'her'];
        
        const wordMap = {};
        words.forEach(word => {
            // Remove punctuation and convert to lowercase
            const cleanWord = word.toLowerCase().replace(/[^\w\s]|_/g, '');
            if (cleanWord && !commonWords.includes(cleanWord)) {
                wordMap[cleanWord] = (wordMap[cleanWord] || 0) + 1;
            }
        });
        
        // Sort words by frequency
        const sortedWords = Object.entries(wordMap).sort((a, b) => b[1] - a[1]);
        
        // Display top 10 keywords
        let html = '';
        const topWords = sortedWords.slice(0, 10);
        
        if (topWords.length === 0) {
            html = '<p class="italic">No significant keywords found</p>';
        } else {
            topWords.forEach(([word, count]) => {
                const percentage = ((count / words.length) * 100).toFixed(1);
                html += `<div class="flex justify-between"><span>${word}</span><span>${count} (${percentage}%)</span></div>`;
            });
        }
        
        keywordDensity.innerHTML = html;
    }
    
    // Initialize the tool
    initWordCounter();
});
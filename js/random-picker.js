/**
 * Random Picker Tool - JavaScript functionality
 * Randomly selects items from a list with customizable options
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const itemsInput = document.getElementById('items-input');
    const numPicks = document.getElementById('num-picks');
    const pickOption = document.getElementById('pick-option');
    const animationSpeed = document.getElementById('animation-speed');
    const showAnimation = document.getElementById('show-animation');
    const pickBtn = document.getElementById('pick-btn');
    const resetBtn = document.getElementById('reset-btn');
    const copyBtn = document.getElementById('copy-btn');
    const saveBtn = document.getElementById('save-btn');
    const animationContainer = document.getElementById('animation-container');
    const animationPlaceholder = document.getElementById('animation-placeholder');
    const resultsContainer = document.getElementById('results-container');
    const resultsPlaceholder = document.getElementById('results-placeholder');
    
    // State variables
    let items = [];
    let selectedItems = [];
    let isAnimating = false;
    let animationInterval = null;
    
    // Initialize the Random Picker Tool
    function initRandomPicker() {
        // Set up event listeners
        setupEventListeners();
        
        // Load saved items if available
        loadSavedItems();
        
        // Set current year in footer
        if (document.getElementById('current-year')) {
            document.getElementById('current-year').textContent = new Date().getFullYear();
        }
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'random-picker');
            }
        }
        
        // Initialize mobile menu
        initMobileMenu();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Pick button click
        pickBtn.addEventListener('click', startPicking);
        
        // Reset button click
        resetBtn.addEventListener('click', resetPicker);
        
        // Copy button click
        copyBtn.addEventListener('click', copyResults);
        
        // Save button click
        saveBtn.addEventListener('click', saveResults);
        
        // Items input change
        itemsInput.addEventListener('input', function() {
            // Save items to localStorage as user types
            localStorage.setItem('random-picker-items', itemsInput.value);
        });
        
        // Number of picks change validation
        numPicks.addEventListener('change', function() {
            // Ensure number is at least 1
            if (parseInt(numPicks.value) < 1) {
                numPicks.value = 1;
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
    
    // Load saved items from localStorage
    function loadSavedItems() {
        const savedItems = localStorage.getItem('random-picker-items');
        if (savedItems) {
            itemsInput.value = savedItems;
        }
    }
    
    // Start the random picking process
    function startPicking() {
        // Parse items from input
        items = itemsInput.value.split('\n')
            .map(item => item.trim())
            .filter(item => item.length > 0);
        
        // Validate items
        if (items.length === 0) {
            showError('Please enter at least one item');
            return;
        }
        
        // Get number of picks
        const numToSelect = parseInt(numPicks.value);
        
        // Validate number of picks
        if (numToSelect < 1) {
            showError('Please select at least one item to pick');
            return;
        }
        
        // Check if we have enough items for without-replacement mode
        if (pickOption.value === 'without-replacement' && numToSelect > items.length) {
            showError(`You can only select up to ${items.length} items without replacement`);
            return;
        }
        
        // Clear previous results
        clearResults();
        
        // Disable buttons during animation
        setButtonsState(false);
        
        // Show animation if enabled
        if (showAnimation.checked) {
            runSelectionAnimation(numToSelect);
        } else {
            // Select items immediately without animation
            selectedItems = selectRandomItems(items, numToSelect, pickOption.value === 'with-replacement');
            displayResults(selectedItems);
            setButtonsState(true);
        }
    }
    
    // Run the selection animation
    function runSelectionAnimation(numToSelect) {
        isAnimating = true;
        animationPlaceholder.style.display = 'none';
        
        // Determine animation speed in milliseconds
        let speed;
        switch (animationSpeed.value) {
            case 'fast':
                speed = 50;
                break;
            case 'slow':
                speed = 200;
                break;
            default: // medium
                speed = 100;
        }
        
        // Calculate total animation time based on number of selections
        const animationDuration = 1500 + (numToSelect * 200); // Base duration + extra time per item
        const iterations = Math.floor(animationDuration / speed);
        let currentIteration = 0;
        
        // Create animation container
        const animationElement = document.createElement('div');
        animationElement.className = 'text-center text-2xl font-bold text-primary';
        animationContainer.appendChild(animationElement);
        
        // Start animation interval
        animationInterval = setInterval(() => {
            currentIteration++;
            
            // Randomly select an item to display during animation
            const randomIndex = Math.floor(Math.random() * items.length);
            animationElement.textContent = items[randomIndex];
            
            // Add some visual effects
            animationElement.style.transform = `scale(${1 + Math.sin(currentIteration / 5) * 0.1})`;
            
            // End animation after set duration
            if (currentIteration >= iterations) {
                clearInterval(animationInterval);
                finishAnimation(numToSelect);
            }
        }, speed);
    }
    
    // Finish the animation and display final results
    function finishAnimation(numToSelect) {
        // Select the final items
        selectedItems = selectRandomItems(items, numToSelect, pickOption.value === 'with-replacement');
        
        // Clear animation
        animationContainer.innerHTML = '';
        
        // Display final selected items with a highlight effect
        const resultElement = document.createElement('div');
        resultElement.className = 'text-center';
        animationContainer.appendChild(resultElement);
        
        // Display each selected item with a delay
        selectedItems.forEach((item, index) => {
            setTimeout(() => {
                const itemSpan = document.createElement('div');
                itemSpan.textContent = item;
                itemSpan.className = 'text-xl font-bold text-primary mb-2 animate-bounce';
                resultElement.appendChild(itemSpan);
                
                // If this is the last item, finish the process
                if (index === selectedItems.length - 1) {
                    setTimeout(() => {
                        isAnimating = false;
                        displayResults(selectedItems);
                        setButtonsState(true);
                    }, 1000);
                }
            }, index * 600);
        });
    }
    
    // Select random items from the list
    function selectRandomItems(itemsList, count, withReplacement) {
        const result = [];
        const availableItems = [...itemsList];
        
        for (let i = 0; i < count; i++) {
            if (availableItems.length === 0) break;
            
            // Select a random index
            const randomIndex = Math.floor(Math.random() * availableItems.length);
            
            // Add the selected item to results
            result.push(availableItems[randomIndex]);
            
            // If without replacement, remove the selected item from available items
            if (!withReplacement) {
                availableItems.splice(randomIndex, 1);
            }
        }
        
        return result;
    }
    
    // Display the selected items in the results container
    function displayResults(items) {
        // Clear placeholder
        resultsPlaceholder.style.display = 'none';
        
        // Create results list
        const resultsList = document.createElement('div');
        resultsList.className = 'space-y-2';
        
        // Add each item to the list
        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'p-2 bg-white rounded shadow-sm';
            itemElement.innerHTML = `<span class="font-medium">${index + 1}.</span> ${item}`;
            resultsList.appendChild(itemElement);
        });
        
        // Add to results container
        resultsContainer.appendChild(resultsList);
        
        // Enable copy and save buttons
        copyBtn.disabled = false;
        saveBtn.disabled = false;
    }
    
    // Reset the picker
    function resetPicker() {
        // Clear results
        clearResults();
        
        // Reset animation
        if (isAnimating) {
            clearInterval(animationInterval);
            isAnimating = false;
        }
        
        // Reset animation container
        animationContainer.innerHTML = '';
        animationPlaceholder.style.display = 'block';
        animationContainer.appendChild(animationPlaceholder);
        
        // Enable buttons
        setButtonsState(true);
    }
    
    // Clear the results
    function clearResults() {
        // Clear selected items
        selectedItems = [];
        
        // Clear results container
        resultsContainer.innerHTML = '';
        resultsPlaceholder.style.display = 'block';
        resultsContainer.appendChild(resultsPlaceholder);
        
        // Disable copy and save buttons
        copyBtn.disabled = true;
        saveBtn.disabled = true;
    }
    
    // Copy results to clipboard
    function copyResults() {
        if (selectedItems.length === 0) return;
        
        // Format results as text
        const resultsText = selectedItems.map((item, index) => `${index + 1}. ${item}`).join('\n');
        
        // Copy to clipboard
        navigator.clipboard.writeText(resultsText).then(() => {
            // Show feedback
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showError('Failed to copy results');
        });
    }
    
    // Save results as a text file
    function saveResults() {
        if (selectedItems.length === 0) return;
        
        // Format results as text
        const resultsText = `Random Selection Results\n\n` + 
                          `Date: ${new Date().toLocaleString()}\n` +
                          `Items Selected: ${selectedItems.length}\n` +
                          `Selection Method: ${pickOption.value === 'with-replacement' ? 'With Replacement' : 'Without Replacement'}\n\n` +
                          selectedItems.map((item, index) => `${index + 1}. ${item}`).join('\n');
        
        // Create a blob and download link
        const blob = new Blob([resultsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `random-selection-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }
    
    // Set the state of buttons (enabled/disabled)
    function setButtonsState(enabled) {
        pickBtn.disabled = !enabled;
        if (!enabled) {
            copyBtn.disabled = true;
            saveBtn.disabled = true;
        }
    }
    
    // Show error message
    function showError(message) {
        // Create error element
        const errorElement = document.createElement('div');
        errorElement.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4';
        errorElement.role = 'alert';
        errorElement.innerHTML = `<span class="block sm:inline">${message}</span>`;
        
        // Add close button
        const closeButton = document.createElement('span');
        closeButton.className = 'absolute top-0 bottom-0 right-0 px-4 py-3';
        closeButton.innerHTML = `<svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>`;
        closeButton.addEventListener('click', () => {
            document.body.removeChild(errorElement);
        });
        errorElement.appendChild(closeButton);
        
        // Add to body
        document.body.appendChild(errorElement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(errorElement)) {
                document.body.removeChild(errorElement);
            }
        }, 5000);
    }
    
    // Initialize the tool
    initRandomPicker();
});
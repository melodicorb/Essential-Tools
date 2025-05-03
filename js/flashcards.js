/**
 * Flashcards Tool - JavaScript functionality
 * Create, study and manage digital flashcards for effective learning
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const flashcardsContainer = document.getElementById('flashcards-container');
    const emptyState = document.getElementById('empty-state');
    const cardsList = document.getElementById('cards-list');
    const studyMode = document.getElementById('study-mode');
    const deckSelector = document.getElementById('deck-selector');
    const createDeckBtn = document.getElementById('create-deck-btn');
    const addCardBtn = document.getElementById('add-card-btn');
    const studyBtn = document.getElementById('study-btn');
    const exitStudyBtn = document.getElementById('exit-study-btn');
    const prevCardBtn = document.getElementById('prev-card-btn');
    const nextCardBtn = document.getElementById('next-card-btn');
    const flipCardBtn = document.getElementById('flip-card-btn');
    const studyCard = document.getElementById('study-card');
    const cardCounter = document.getElementById('card-counter');
    const cardFrontText = document.getElementById('card-front-text');
    const cardBackText = document.getElementById('card-back-text');
    
    // State variables
    let decks = [];
    let currentDeckIndex = -1;
    let currentCardIndex = 0;
    let isCardFlipped = false;
    
    // Initialize the flashcards tool
    function initFlashcards() {
        // Load saved decks from local storage
        loadDecks();
        
        // Set up event listeners
        setupEventListeners();
        
        // Update the deck selector
        updateDeckSelector();
        
        // Set current year in footer
        if (document.getElementById('current-year')) {
            document.getElementById('current-year').textContent = new Date().getFullYear();
        }
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'flashcards');
            }
        }
    }
    
    // Load decks from local storage
    function loadDecks() {
        const savedDecks = localStorage.getItem('flashcards-decks');
        if (savedDecks) {
            decks = JSON.parse(savedDecks);
        }
    }
    
    // Save decks to local storage
    function saveDecks() {
        localStorage.setItem('flashcards-decks', JSON.stringify(decks));
    }
    
    // Update the deck selector dropdown
    function updateDeckSelector() {
        // Clear existing options except the first one
        while (deckSelector.options.length > 1) {
            deckSelector.remove(1);
        }
        
        // Add options for each deck
        decks.forEach((deck, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = deck.name;
            deckSelector.appendChild(option);
        });
        
        // Update UI based on selected deck
        updateUI();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Create new deck
        createDeckBtn.addEventListener('click', createNewDeck);
        
        // Deck selection change
        deckSelector.addEventListener('change', function() {
            currentDeckIndex = this.value === '' ? -1 : parseInt(this.value);
            updateUI();
        });
        
        // Add new card
        addCardBtn.addEventListener('click', addNewCard);
        
        // Study mode
        studyBtn.addEventListener('click', enterStudyMode);
        exitStudyBtn.addEventListener('click', exitStudyMode);
        
        // Study navigation
        prevCardBtn.addEventListener('click', showPreviousCard);
        nextCardBtn.addEventListener('click', showNextCard);
        flipCardBtn.addEventListener('click', flipCard);
        studyCard.addEventListener('click', flipCard);
        
        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
    
    // Update UI based on current state
    function updateUI() {
        // Hide all views first
        emptyState.classList.add('hidden');
        cardsList.classList.add('hidden');
        studyMode.classList.add('hidden');
        
        // Disable buttons by default
        addCardBtn.disabled = true;
        studyBtn.disabled = true;
        addCardBtn.classList.add('opacity-50', 'cursor-not-allowed');
        studyBtn.classList.add('opacity-50', 'cursor-not-allowed');
        
        if (currentDeckIndex === -1 || decks.length === 0) {
            // No deck selected or no decks exist
            emptyState.classList.remove('hidden');
        } else {
            // Deck selected
            const currentDeck = decks[currentDeckIndex];
            
            // Enable buttons
            addCardBtn.disabled = false;
            addCardBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            
            if (currentDeck.cards.length > 0) {
                studyBtn.disabled = false;
                studyBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
            
            // Show cards list
            cardsList.classList.remove('hidden');
            renderCardsList(currentDeck);
        }
    }
    
    // Create a new deck
    function createNewDeck() {
        const deckName = prompt('Enter a name for your new deck:');
        if (deckName && deckName.trim() !== '') {
            const newDeck = {
                name: deckName.trim(),
                cards: []
            };
            
            decks.push(newDeck);
            currentDeckIndex = decks.length - 1;
            
            saveDecks();
            updateDeckSelector();
            
            // Select the new deck in the dropdown
            deckSelector.value = currentDeckIndex;
        }
    }
    
    // Add a new card to the current deck
    function addNewCard() {
        if (currentDeckIndex === -1) return;
        
        const frontText = prompt('Enter the front text (question):');
        if (!frontText || frontText.trim() === '') return;
        
        const backText = prompt('Enter the back text (answer):');
        if (!backText || backText.trim() === '') return;
        
        const newCard = {
            front: frontText.trim(),
            back: backText.trim(),
            id: Date.now() // Use timestamp as unique ID
        };
        
        decks[currentDeckIndex].cards.push(newCard);
        saveDecks();
        updateUI();
    }
    
    // Render the list of cards for the current deck
    function renderCardsList(deck) {
        // Clear existing cards
        cardsList.innerHTML = '';
        
        // Add each card
        deck.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'bg-white border-2 border-primary rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow';
            cardElement.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs text-gray-500">Card ${index + 1}</span>
                    <div class="flex space-x-2">
                        <button class="text-gray-500 hover:text-gray-700" onclick="editCard(${index})">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button class="text-gray-500 hover:text-red-600" onclick="deleteCard(${index})">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="border-b border-gray-200 mb-2"></div>
                <div class="mb-2">
                    <p class="font-semibold text-gray-900">Front:</p>
                    <p class="text-gray-800">${card.front}</p>
                </div>
                <div>
                    <p class="font-semibold text-gray-900">Back:</p>
                    <p class="text-gray-800">${card.back}</p>
                </div>
            `;
            
            cardsList.appendChild(cardElement);
        });
    }
    
    // Enter study mode
    function enterStudyMode() {
        if (currentDeckIndex === -1 || decks[currentDeckIndex].cards.length === 0) return;
        
        // Hide cards list and show study mode
        cardsList.classList.add('hidden');
        studyMode.classList.remove('hidden');
        
        // Reset study state
        currentCardIndex = 0;
        isCardFlipped = false;
        
        // Update the study card
        updateStudyCard();
    }
    
    // Exit study mode
    function exitStudyMode() {
        studyMode.classList.add('hidden');
        cardsList.classList.remove('hidden');
    }
    
    // Update the study card with current card data
    function updateStudyCard() {
        const currentDeck = decks[currentDeckIndex];
        const currentCard = currentDeck.cards[currentCardIndex];
        
        // Update card counter
        cardCounter.textContent = `Card ${currentCardIndex + 1} of ${currentDeck.cards.length}`;
        
        // Update card content
        cardFrontText.textContent = currentCard.front;
        cardBackText.textContent = currentCard.back;
        
        // Reset card flip state
        if (isCardFlipped) {
            flipCard();
        }
    }
    
    // Show the previous card in study mode
    function showPreviousCard() {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            updateStudyCard();
        }
    }
    
    // Show the next card in study mode
    function showNextCard() {
        const currentDeck = decks[currentDeckIndex];
        if (currentCardIndex < currentDeck.cards.length - 1) {
            currentCardIndex++;
            updateStudyCard();
        }
    }
    
    // Flip the current card in study mode
    function flipCard() {
        const cardInner = studyCard.querySelector('.flashcard-inner');
        isCardFlipped = !isCardFlipped;
        
        if (isCardFlipped) {
            cardInner.style.transform = 'rotateY(180deg)';
        } else {
            cardInner.style.transform = 'rotateY(0deg)';
        }
    }
    
    // Edit a card
    window.editCard = function(index) {
        if (currentDeckIndex === -1) return;
        
        const card = decks[currentDeckIndex].cards[index];
        
        const frontText = prompt('Edit the front text (question):', card.front);
        if (!frontText || frontText.trim() === '') return;
        
        const backText = prompt('Edit the back text (answer):', card.back);
        if (!backText || backText.trim() === '') return;
        
        card.front = frontText.trim();
        card.back = backText.trim();
        
        saveDecks();
        updateUI();
    };
    
    // Delete a card
    window.deleteCard = function(index) {
        if (currentDeckIndex === -1) return;
        
        if (confirm('Are you sure you want to delete this card?')) {
            decks[currentDeckIndex].cards.splice(index, 1);
            saveDecks();
            updateUI();
        }
    };
    
    // Initialize the tool
    initFlashcards();
});

// FAQ Toggle Function
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    answer.classList.toggle('hidden');
    const icon = element.querySelector('svg');
    icon.classList.toggle('rotate-180');
}

// Set current year in footer
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('current-year')) {
        document.getElementById('current-year').textContent = new Date().getFullYear();
    }
});
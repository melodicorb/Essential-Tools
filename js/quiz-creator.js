/**
 * Quiz Creator - JavaScript functionality
 * Create, edit, and share custom quizzes
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const quizMode = document.getElementById('quiz-mode');
    const createQuizSection = document.getElementById('create-quiz-section');
    const editQuizSection = document.getElementById('edit-quiz-section');
    const takeQuizSection = document.getElementById('take-quiz-section');
    const quizTitle = document.getElementById('quiz-title');
    const quizDescription = document.getElementById('quiz-description');
    const questionsContainer = document.getElementById('questions-container');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const saveQuizBtn = document.getElementById('save-quiz-btn');
    const clearQuizBtn = document.getElementById('clear-quiz-btn');
    const quizSelect = document.getElementById('quiz-select');
    const takeQuizSelect = document.getElementById('take-quiz-select');
    const editQuizContent = document.getElementById('edit-quiz-content');
    const quizContent = document.getElementById('quiz-content');
    const resultDisplay = document.getElementById('result-display');
    const resultText = document.getElementById('result-text');
    const shareQuizSection = document.getElementById('share-quiz-section');
    const shareLink = document.getElementById('share-link');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    
    // Settings
    let settings = {
        autoSave: true
    };
    
    // Current quiz data
    let currentQuiz = {
        id: null,
        title: '',
        description: '',
        questions: []
    };
    
    // Question counter
    let questionCounter = 1;
    
    // Initialize the Quiz Creator
    function initQuizCreator() {
        // Load saved settings if available
        loadSettings();
        
        // Set up event listeners
        setupEventListeners();
        
        // Load saved quizzes
        loadSavedQuizzes();
        
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'quiz-creator');
            }
        }
        
        // Initialize mobile menu
        initMobileMenu();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Quiz mode changes
        quizMode.addEventListener('change', function() {
            updateQuizMode();
        });
        
        // Add question button
        addQuestionBtn.addEventListener('click', function() {
            addQuestion();
        });
        
        // Save quiz button
        saveQuizBtn.addEventListener('click', function() {
            saveQuiz();
        });
        
        // Clear quiz button
        clearQuizBtn.addEventListener('click', function() {
            clearQuiz();
        });
        
        // Quiz select for editing
        quizSelect.addEventListener('change', function() {
            loadQuizForEditing();
        });
        
        // Quiz select for taking
        takeQuizSelect.addEventListener('change', function() {
            loadQuizForTaking();
        });
        
        // Copy link button
        copyLinkBtn.addEventListener('click', function() {
            copyToClipboard(shareLink.value);
        });
        
        // Event delegation for dynamic elements
        document.addEventListener('click', function(event) {
            // Delete question button
            if (event.target.closest('.delete-question-btn')) {
                const questionItem = event.target.closest('.question-item');
                if (questionItem) {
                    questionItem.remove();
                    updateQuestionNumbers();
                }
            }
            
            // Add option button
            if (event.target.closest('.add-option-btn')) {
                const optionsContainer = event.target.closest('.options-container');
                const questionItem = event.target.closest('.question-item');
                if (optionsContainer && questionItem) {
                    const optionsList = optionsContainer.querySelector('.space-y-2');
                    const questionIndex = Array.from(questionsContainer.children).indexOf(questionItem) + 1;
                    const optionCount = optionsList.children.length + 1;
                    
                    const optionHTML = `
                        <div class="flex items-center">
                            <input type="radio" name="correct-${questionIndex}" class="h-4 w-4 text-primary focus:ring-primary border-gray-300">
                            <input type="text" class="option-text ml-2 flex-grow px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Option ${optionCount}">
                        </div>
                    `;
                    
                    optionsList.insertAdjacentHTML('beforeend', optionHTML);
                }
            }
        });
        
        // Event delegation for question type changes
        document.addEventListener('change', function(event) {
            if (event.target.classList.contains('question-type')) {
                const questionItem = event.target.closest('.question-item');
                if (questionItem) {
                    updateQuestionType(questionItem, event.target.value);
                }
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
    
    // Update quiz mode (create, edit, take)
    function updateQuizMode() {
        const mode = quizMode.value;
        
        // Hide all sections first
        createQuizSection.classList.add('hidden');
        editQuizSection.classList.add('hidden');
        takeQuizSection.classList.add('hidden');
        shareQuizSection.classList.add('hidden');
        resultDisplay.classList.add('hidden');
        
        // Show the selected section
        if (mode === 'create') {
            createQuizSection.classList.remove('hidden');
            saveQuizBtn.textContent = 'Save Quiz';
            clearQuizBtn.classList.remove('hidden');
        } else if (mode === 'edit') {
            editQuizSection.classList.remove('hidden');
            saveQuizBtn.textContent = 'Update Quiz';
            clearQuizBtn.classList.remove('hidden');
        } else if (mode === 'take') {
            takeQuizSection.classList.remove('hidden');
            saveQuizBtn.textContent = 'Submit Answers';
            clearQuizBtn.classList.add('hidden');
        }
    }
    
    // Add a new question
    function addQuestion() {
        const questionHTML = `
            <div class="p-4 border border-gray-200 rounded-md question-item">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-md font-medium">Question ${questionCounter}</h3>
                    <button class="delete-question-btn text-red-500 hover:text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
                <div class="mb-2">
                    <input type="text" class="question-text w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter question text">
                </div>
                <div class="mb-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Question Type:</label>
                    <select class="question-type w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                        <option value="short-answer">Short Answer</option>
                    </select>
                </div>
                <div class="options-container mb-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Options:</label>
                    <div class="space-y-2 mb-2">
                        <div class="flex items-center">
                            <input type="radio" name="correct-${questionCounter}" class="h-4 w-4 text-primary focus:ring-primary border-gray-300">
                            <input type="text" class="option-text ml-2 flex-grow px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Option 1">
                        </div>
                        <div class="flex items-center">
                            <input type="radio" name="correct-${questionCounter}" class="h-4 w-4 text-primary focus:ring-primary border-gray-300">
                            <input type="text" class="option-text ml-2 flex-grow px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Option 2">
                        </div>
                    </div>
                    <button class="add-option-btn text-sm text-primary hover:text-blue-700 font-medium">+ Add Option</button>
                </div>
            </div>
        `;
        
        questionsContainer.insertAdjacentHTML('beforeend', questionHTML);
        questionCounter++;
    }
    
    // Update question type
    function updateQuestionType(questionItem, type) {
        const optionsContainer = questionItem.querySelector('.options-container');
        
        if (type === 'multiple-choice') {
            optionsContainer.classList.remove('hidden');
            // Ensure there are at least 2 options
            const optionsList = optionsContainer.querySelector('.space-y-2');
            if (optionsList.children.length < 2) {
                const questionIndex = Array.from(questionsContainer.children).indexOf(questionItem) + 1;
                
                optionsList.innerHTML = `
                    <div class="flex items-center">
                        <input type="radio" name="correct-${questionIndex}" class="h-4 w-4 text-primary focus:ring-primary border-gray-300">
                        <input type="text" class="option-text ml-2 flex-grow px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Option 1">
                    </div>
                    <div class="flex items-center">
                        <input type="radio" name="correct-${questionIndex}" class="h-4 w-4 text-primary focus:ring-primary border-gray-300">
                        <input type="text" class="option-text ml-2 flex-grow px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Option 2">
                    </div>
                `;
            }
        } else if (type === 'true-false') {
            optionsContainer.classList.remove('hidden');
            const questionIndex = Array.from(questionsContainer.children).indexOf(questionItem) + 1;
            
            // Set to True/False options
            const optionsList = optionsContainer.querySelector('.space-y-2');
            optionsList.innerHTML = `
                <div class="flex items-center">
                    <input type="radio" name="correct-${questionIndex}" class="h-4 w-4 text-primary focus:ring-primary border-gray-300">
                    <input type="text" class="option-text ml-2 flex-grow px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" value="True" readonly>
                </div>
                <div class="flex items-center">
                    <input type="radio" name="correct-${questionIndex}" class="h-4 w-4 text-primary focus:ring-primary border-gray-300">
                    <input type="text" class="option-text ml-2 flex-grow px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" value="False" readonly>
                </div>
            `;
            
            // Hide add option button
            const addOptionBtn = optionsContainer.querySelector('.add-option-btn');
            addOptionBtn.classList.add('hidden');
        } else if (type === 'short-answer') {
            // Hide options for short answer
            optionsContainer.classList.add('hidden');
        }
    }
    
    // Update question numbers
    function updateQuestionNumbers() {
        const questionItems = questionsContainer.querySelectorAll('.question-item');
        questionItems.forEach((item, index) => {
            const questionNumber = item.querySelector('h3');
            if (questionNumber) {
                questionNumber.textContent = `Question ${index + 1}`;
            }
            
            // Update radio button names
            const radioButtons = item.querySelectorAll('input[type="radio"]');
            radioButtons.forEach(radio => {
                radio.name = `correct-${index + 1}`;
            });
        });
        
        // Update question counter
        questionCounter = questionItems.length + 1;
    }
    
    // Save quiz
    function saveQuiz() {
        const mode = quizMode.value;
        
        if (mode === 'create' || mode === 'edit') {
            // Validate quiz
            if (!validateQuiz()) {
                return;
            }
            
            // Collect quiz data
            const quizData = collectQuizData();
            
            // Generate ID if creating new quiz
            if (mode === 'create' || !quizData.id) {
                quizData.id = generateQuizId();
            }
            
            // Save to local storage
            saveQuizToStorage(quizData);
            
            // Update quiz selects
            loadSavedQuizzes();
            
            // Show success message
            showResult(`<p class="text-green-600 font-semibold">Quiz "${quizData.title}" has been saved successfully!</p>`);
            
            // Show share section
            updateShareLink(quizData.id);
            shareQuizSection.classList.remove('hidden');
            
            // Clear form if creating new quiz
            if (mode === 'create') {
                clearQuiz();
            }
        } else if (mode === 'take') {
            // Submit quiz answers
            submitQuizAnswers();
        }
    }
    
    // Validate quiz
    function validateQuiz() {
        // Check title
        if (!quizTitle.value.trim()) {
            showError('Please enter a quiz title');
            return false;
        }
        
        // Check if there are questions
        if (questionsContainer.children.length === 0) {
            showError('Please add at least one question');
            return false;
        }
        
        // Check each question
        const questionItems = questionsContainer.querySelectorAll('.question-item');
        for (let i = 0; i < questionItems.length; i++) {
            const item = questionItems[i];
            const questionText = item.querySelector('.question-text').value.trim();
            const questionType = item.querySelector('.question-type').value;
            
            if (!questionText) {
                showError(`Question ${i + 1} is missing text`);
                return false;
            }
            
            if (questionType === 'multiple-choice' || questionType === 'true-false') {
                const options = item.querySelectorAll('.option-text');
                const selectedOption = item.querySelector('input[type="radio"]:checked');
                
                // Check if all options have text
                for (let j = 0; j < options.length; j++) {
                    if (!options[j].value.trim() && questionType === 'multiple-choice') {
                        showError(`Question ${i + 1}, Option ${j + 1} is missing text`);
                        return false;
                    }
                }
                
                // Check if a correct answer is selected
                if (!selectedOption) {
                    showError(`Please select a correct answer for Question ${i + 1}`);
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // Collect quiz data
    function collectQuizData() {
        const quizData = {
            id: currentQuiz.id,
            title: quizTitle.value.trim(),
            description: quizDescription.value.trim(),
            questions: []
        };
        
        const questionItems = questionsContainer.querySelectorAll('.question-item');
        questionItems.forEach((item, index) => {
            const questionText = item.querySelector('.question-text').value.trim();
            const questionType = item.querySelector('.question-type').value;
            
            const question = {
                id: index + 1,
                text: questionText,
                type: questionType,
                options: []
            };
            
            if (questionType === 'multiple-choice' || questionType === 'true-false') {
                const options = item.querySelectorAll('.option-text');
                const radioButtons = item.querySelectorAll('input[type="radio"]');
                
                options.forEach((option, optIndex) => {
                    question.options.push({
                        id: optIndex + 1,
                        text: option.value.trim(),
                        isCorrect: radioButtons[optIndex].checked
                    });
                });
            } else if (questionType === 'short-answer') {
                // For short answer, we'll add a placeholder option for the correct answer
                // This would be enhanced in a real implementation
                question.options.push({
                    id: 1,
                    text: 'Correct Answer',
                    isCorrect: true
                });
            }
            
            quizData.questions.push(question);
        });
        
        return quizData;
    }
    
    // Generate a unique quiz ID
    function generateQuizId() {
        return 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Save quiz to local storage
    function saveQuizToStorage(quizData) {
        // Get existing quizzes
        let quizzes = JSON.parse(localStorage.getItem('quizzes') || '{}');
        
        // Add or update the quiz
        quizzes[quizData.id] = quizData;
        
        // Save back to storage
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        
        // Update current quiz
        currentQuiz = quizData;
    }
    
    // Load saved quizzes
    function loadSavedQuizzes() {
        // Get quizzes from storage
        const quizzes = JSON.parse(localStorage.getItem('quizzes') || '{}');
        
        // Clear select options
        quizSelect.innerHTML = '<option value="">-- Select a quiz --</option>';
        takeQuizSelect.innerHTML = '<option value="">-- Select a quiz --</option>';
        
        // Add options for each quiz
        for (const id in quizzes) {
            const quiz = quizzes[id];
            const option = document.createElement('option');
            option.value = id;
            option.textContent = quiz.title;
            
            // Add to both selects
            quizSelect.appendChild(option.cloneNode(true));
            takeQuizSelect.appendChild(option);
        }
    }
    
    // Load quiz for editing
    function loadQuizForEditing() {
        const quizId = quizSelect.value;
        
        if (!quizId) {
            editQuizContent.classList.add('hidden');
            return;
        }
        
        // Get quiz from storage
        const quizzes = JSON.parse(localStorage.getItem('quizzes') || '{}');
        const quiz = quizzes[quizId];
        
        if (!quiz) {
            showError('Quiz not found');
            return;
        }
        
        // Set current quiz
        currentQuiz = quiz;
        
        // Populate form
        quizTitle.value = quiz.title;
        quizDescription.value = quiz.description || '';
        
        // Clear existing questions
        questionsContainer.innerHTML = '';
        
        // Add questions
        quiz.questions.forEach((question, index) => {
            addQuestionForEditing(question, index + 1);
        });
        
        // Update question counter
        questionCounter = quiz.questions.length + 1;
        
        // Show edit content
        createQuizSection.classList.remove('hidden');
        editQuizContent.classList.remove('hidden');
    }
    
    // Add question for editing
    function addQuestionForEditing(question, number) {
        // Create question element
        const questionItem = document.createElement('div');
        questionItem.className = 'p-4 border border-gray-200 rounded-md question-item';
        
        // Add question header
        questionItem.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h3 class="text-md font-medium">Question ${number}</h3>
                <button class="delete-question-btn text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
            <div class="mb-2">
                <input type="text" class="question-text w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter question text" value="${question.text}">
            </div>
            <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Question Type:</label>
                <select class="question-type w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="multiple-choice" ${question.type === 'multiple-choice' ? 'selected' : ''}>Multiple Choice</option>
                    <option value="true-false" ${question.type === 'true-false' ? 'selected' : ''}>True/False</option>
                    <option value="short-answer" ${question.type === 'short-answer' ? 'selected' : ''}>Short Answer</option>
                </select>
            </div>
            <div class="options-container mb-2" ${question.type === 'short-answer' ? 'style="display:none;"' : ''}>
                <label class="block text-sm font-medium text-gray-700 mb-1">Options:</label>
                <div class="space-y-2 mb-2">
                    ${generateOptionsHTML(question.options, number)}
                </div>
                <button class="add-option-btn text-sm text-primary hover:text-blue-700 font-medium" ${question.type === 'true-false' ? 'style="display:none;"' : ''}>+ Add Option</button>
            </div>
        `;
        
        // Add to container
        questionsContainer.appendChild(questionItem);
    }
    
    // Generate options HTML
    function generateOptionsHTML(options, questionNumber) {
        let html = '';
        
        options.forEach((option, index) => {
            html += `
                <div class="flex items-center">
                    <input type="radio" name="correct-${questionNumber}" class="h-4 w-4 text-primary focus:ring-primary border-gray-300" ${option.isCorrect ? 'checked' : ''}>
                    <input type="text" class="option-text ml-2 flex-grow px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Option ${index + 1}" value="${option.text}" ${option.text === 'True' || option.text === 'False' ? 'readonly' : ''}>
                </div>
            `;
        });
        
        return html;
    }
    
    // Load quiz for taking
    function loadQuizForTaking() {
        const quizId = takeQuizSelect.value;
        
        if (!quizId) {
            quizContent.classList.add('hidden');
            return;
        }
        
        // Get quiz from storage
        const quizzes = JSON.parse(localStorage.getItem('quizzes') || '{}');
        const quiz = quizzes[quizId];
        
        if (!quiz) {
            showError('Quiz not found');
            return;
        }
        
        // Set current quiz
        currentQuiz = quiz;
        
        // Generate quiz content
        let html = `
            <div class="mb-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-2">${quiz.title}</h2>
                ${quiz.description ? `<p class="text-gray-600 mb-4">${quiz.description}</p>` : ''}
                <p class="text-sm text-gray-500">${quiz.questions.length} question${quiz.questions.length !== 1 ? 's' : ''}</p>
            </div>
            <div class="space-y-6" id="quiz-questions">
        `;
        
        // Add questions
        quiz.questions.forEach((question, index) => {
            html += `
                <div class="p-4 border border-gray-200 rounded-md quiz-question" data-question-id="${question.id}" data-question-type="${question.type}">
                    <h3 class="text-md font-medium mb-3">Question ${index + 1}: ${question.text}</h3>
                    ${generateQuizQuestionContent(question, index)}
                </div>
            `;
        });
        
        html += '</div>';
        
        // Set content
        quizContent.innerHTML = html;
        quizContent.classList.remove('hidden');
    }
    
    // Generate quiz question content
    function generateQuizQuestionContent(question, index) {
        let html = '';
        
        if (question.type === 'multiple-choice' || question.type === 'true-false') {
            html += '<div class="space-y-2">';
            
            question.options.forEach((option, optIndex) => {
                html += `
                    <div class="flex items-center">
                        <input type="radio" name="answer-${index}" id="answer-${index}-${optIndex}" value="${option.id}" class="h-4 w-4 text-primary focus:ring-primary border-gray-300">
                        <label for="answer-${index}-${optIndex}" class="ml-2 text-gray-700">${option.text}</label>
                    </div>
                `;
            });
            
            html += '</div>';
        } else if (question.type === 'short-answer') {
            html += `
                <div>
                    <input type="text" name="answer-${index}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Your answer">
                </div>
            `;
        }
        
        return html;
    }
    
    // Submit quiz answers
    function submitQuizAnswers() {
        const quizQuestions = document.querySelectorAll('.quiz-question');
        let score = 0;
        let totalQuestions = quizQuestions.length;
        let answers = [];
        
        // Collect answers
        quizQuestions.forEach((questionEl, index) => {
            const questionId = questionEl.dataset.questionId;
            const questionType = questionEl.dataset.questionType;
            let userAnswer = null;
            
            if (questionType === 'multiple-choice' || questionType === 'true-false') {
                const selectedOption = questionEl.querySelector(`input[name="answer-${index}"]:checked`);
                userAnswer = selectedOption ? parseInt(selectedOption.value) : null;
            } else if (questionType === 'short-answer') {
                const inputField = questionEl.querySelector(`input[name="answer-${index}"]`);
                userAnswer = inputField ? inputField.value.trim() : null;
            }
            
            answers.push({
                questionId: parseInt(questionId),
                userAnswer: userAnswer
            });
        });
        
        // Check answers against correct answers
        answers.forEach(answer => {
            const question = currentQuiz.questions.find(q => q.id === answer.questionId);
            if (!question) return;
            
            if (question.type === 'multiple-choice' || question.type === 'true-false') {
                const correctOption = question.options.find(opt => opt.isCorrect);
                if (correctOption && answer.userAnswer === correctOption.id) {
                    score++;
                }
            } else if (question.type === 'short-answer') {
                // Simple exact match for short answer
                // In a real implementation, this would be more sophisticated
                const correctOption = question.options.find(opt => opt.isCorrect);
                if (correctOption && answer.userAnswer && answer.userAnswer.toLowerCase() === correctOption.text.toLowerCase()) {
                    score++;
                }
            }
        });
        
        // Display results
        const percentage = Math.round((score / totalQuestions) * 100);
        let resultHTML = `
            <p class="text-xl font-semibold mb-2">Quiz Results</p>
            <p class="text-lg mb-4">You scored ${score} out of ${totalQuestions} (${percentage}%)</p>
        `;
        
        // Add feedback based on score
        if (percentage >= 90) {
            resultHTML += '<p class="text-green-600 font-semibold">Excellent! You have mastered this topic!</p>';
        } else if (percentage >= 70) {
            resultHTML += '<p class="text-green-600 font-semibold">Good job! You have a solid understanding of this topic.</p>';
        } else if (percentage >= 50) {
            resultHTML += '<p class="text-yellow-600 font-semibold">Not bad, but there\'s room for improvement.</p>';
        } else {
            resultHTML += '<p class="text-red-600 font-semibold">You might need to study this topic more.</p>';
        }
        
        showResult(resultHTML);
    }
    
    // Clear quiz
    function clearQuiz() {
        // Reset form
        quizTitle.value = '';
        quizDescription.value = '';
        questionsContainer.innerHTML = '';
        
        // Reset question counter
        questionCounter = 1;
        
        // Add initial question
        addQuestion();
        
        // Reset current quiz
        currentQuiz = {
            id: null,
            title: '',
            description: '',
            questions: []
        };
        
        // Hide result and share section
        resultDisplay.classList.add('hidden');
        shareQuizSection.classList.add('hidden');
    }
    
    // Update share link
    function updateShareLink(quizId) {
        // In a real implementation, this would generate a shareable link
        // For this demo, we'll just create a link to the current page with the quiz ID
        const baseUrl = window.location.href.split('?')[0];
        const shareUrl = `${baseUrl}?quiz=${quizId}`;
        
        shareLink.value = shareUrl;
    }
    
    // Show result
    function showResult(html) {
        resultText.innerHTML = html;
        resultDisplay.classList.remove('hidden');
    }
    
    // Show error
    function showError(message) {
        resultText.innerHTML = `<p class="text-red-600">${message}</p>`;
        resultDisplay.classList.remove('hidden');
    }
    
    // Copy to clipboard
    function copyToClipboard(text) {
        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        
        // Select and copy the text
        textarea.select();
        document.execCommand('copy');
        
        // Remove the temporary textarea
        document.body.removeChild(textarea);
        
        // Show feedback
        const originalText = copyLinkBtn.textContent;
        copyLinkBtn.textContent = 'Copied!';
        
        // Reset button text after a delay
        setTimeout(() => {
            copyLinkBtn.textContent = originalText;
        }, 2000);
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('quizCreatorSettings');
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                settings = { ...settings, ...parsedSettings };
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }
    
    // Save settings to localStorage
    function saveSettings() {
        try {
            localStorage.setItem('quizCreatorSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }
    
    // Initialize the tool
    initQuizCreator();
});

// Add Quiz Creator 3D Icon to Tool3DIcon object
if (typeof Tool3DIcon !== 'undefined') {
    Tool3DIcon.createQuizCreatorIcon = function(scene, colors) {
        const group = new THREE.Group();
        
        // Create a clipboard/quiz paper
        const clipboard = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2.5, 0.1),
            new THREE.MeshStandardMaterial({ 
                color: 0xF3F4F6, // Light gray for paper
                metalness: 0.1,
                roughness: 0.8
            })
        );
        group.add(clipboard);
        
        // Add clipboard border/backing
        const clipboardBorder = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 2.7, 0.05),
            new THREE.MeshStandardMaterial({ 
                color: 0x9CA3AF, // Darker gray for border
                metalness: 0.2,
                roughness: 0.7
            })
        );
        clipboardBorder.position.z = -0.08;
        group.add(clipboardBorder);
        
        // Add clipboard clip at top
        const clip = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.2, 0.2),
            new THREE.MeshStandardMaterial({ 
                color: 0x6B7280, // Medium gray for clip
                metalness: 0.4,
                roughness: 0.6
            })
        );
        clip.position.set(0, 1.3, 0.1);
        group.add(clip);
        
        // Add quiz lines (representing text)
        const createQuizLine = (y, width, color) => {
            const line = new THREE.Mesh(
                new THREE.BoxGeometry(width, 0.08, 0.02),
                new THREE.MeshStandardMaterial({ color: color })
            );
            line.position.set(0, y, 0.06);
            return line;
        };
        
        // Add title line
        group.add(createQuizLine(0.9, 1.6, 0x3B82F6)); // Blue for title
        
        // Add question lines
        group.add(createQuizLine(0.5, 1.6, 0x6B7280));
        
        // Add multiple choice options
        const createOption = (y, x) => {
            // Option bullet
            const bullet = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 16, 16),
                new THREE.MeshStandardMaterial({ color: 0x8B5CF6 }) // Purple for bullets
            );
            bullet.position.set(x, y, 0.06);
            group.add(bullet);
            
            // Option line
            const line = new THREE.Mesh(
                new THREE.BoxGeometry(1, 0.06, 0.02),
                new THREE.MeshStandardMaterial({ color: 0x6B7280 })
            );
            line.position.set(x + 0.6, y, 0.06);
            group.add(line);
        };
        
        // Add options
        createOption(0.2, -0.7);
        createOption(-0.1, -0.7);
        createOption(-0.4, -0.7);
        
        // Add checkmark for correct answer
        const createCheckmark = () => {
            const checkGroup = new THREE.Group();
            
            // First line of checkmark
            const line1 = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.05, 0.02),
                new THREE.MeshStandardMaterial({ color: 0x10B981 }) // Green for checkmark
            );
            line1.rotation.z = Math.PI / 4;
            line1.position.set(-0.05, -0.05, 0);
            checkGroup.add(line1);
            
            // Second line of checkmark
            const line2 = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 0.05, 0.02),
                new THREE.MeshStandardMaterial({ color: 0x10B981 })
            );
            line2.rotation.z = -Math.PI / 4;
            line2.position.set(0.05, -0.05, 0);
            checkGroup.add(line2);
            
            checkGroup.position.set(-0.7, 0.2, 0.1);
            return checkGroup;
        };
        
        group.add(createCheckmark());
        
        scene.add(group);
        return group;
    };
}
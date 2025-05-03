/**
 * Note Taking Tool - JavaScript functionality
 * Provides interactive note creation, editing, and management capabilities
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const notesList = document.getElementById('notes-list');
    const emptyState = document.getElementById('empty-state');
    const noteEditor = document.getElementById('note-editor');
    const noteTitle = document.getElementById('note-title');
    const noteCategory = document.getElementById('note-category');
    const noteContent = document.getElementById('note-content');
    const newNoteBtn = document.getElementById('new-note-btn');
    const emptyStateBtn = document.getElementById('empty-state-btn');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const cancelNoteBtn = document.getElementById('cancel-note-btn');
    const deleteNoteBtn = document.getElementById('delete-note-btn');
    const searchInput = document.getElementById('search-notes');
    const categoryFilters = document.querySelectorAll('.category-filter');

    // State variables
    let notes = [];
    let currentNoteId = null;
    let currentFilter = 'all';
    let searchTerm = '';

    // Initialize the note-taking app
    function initNoteApp() {
        loadNotesFromLocalStorage();
        renderNotes();
        setupEventListeners();
        initToolIcon();
    }

    // Load notes from localStorage
    function loadNotesFromLocalStorage() {
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
            notes = JSON.parse(savedNotes);
        }
    }

    // Save notes to localStorage
    function saveNotesToLocalStorage() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    // Render notes list
    function renderNotes() {
        // Clear the notes list
        notesList.innerHTML = '';
        
        // Filter notes based on category and search term
        let filteredNotes = notes.filter(note => {
            const matchesCategory = currentFilter === 'all' || note.category === currentFilter;
            const matchesSearch = searchTerm === '' || 
                note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                note.content.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        // Sort notes by last modified date (newest first)
        filteredNotes.sort((a, b) => b.lastModified - a.lastModified);
        
        // Show empty state if no notes
        if (filteredNotes.length === 0) {
            if (notes.length === 0) {
                emptyState.classList.remove('hidden');
            } else {
                // No notes match the filter/search
                notesList.innerHTML = `
                    <div class="text-center py-8">
                        <p class="text-gray-500">No notes match your search or filter</p>
                    </div>
                `;
            }
            return;
        }
        
        // Hide empty state if we have notes
        emptyState.classList.add('hidden');
        
        // Render each note
        filteredNotes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow';
            
            // Format the date
            const date = new Date(note.lastModified);
            const formattedDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            // Create category badge if category exists
            let categoryBadge = '';
            if (note.category) {
                const categoryColors = {
                    'work': 'bg-blue-100 text-blue-800',
                    'personal': 'bg-green-100 text-green-800',
                    'ideas': 'bg-purple-100 text-purple-800',
                    'other': 'bg-yellow-100 text-yellow-800'
                };
                const colorClass = categoryColors[note.category] || 'bg-gray-100 text-gray-800';
                categoryBadge = `<span class="${colorClass} text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">${note.category}</span>`;
            }
            
            // Create note preview (first 100 characters)
            const contentPreview = note.content.length > 100 ? 
                note.content.substring(0, 100) + '...' : 
                note.content;
            
            noteElement.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-semibold">${note.title}</h3>
                    <span class="text-xs text-gray-500">${formattedDate}</span>
                </div>
                <div class="mb-2">
                    ${categoryBadge}
                </div>
                <p class="text-gray-600 text-sm mb-2">${contentPreview}</p>
                <button class="text-primary hover:text-blue-700 text-sm font-medium">Edit Note</button>
            `;
            
            // Add click event to open the note
            noteElement.addEventListener('click', () => openNote(note.id));
            
            notesList.appendChild(noteElement);
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // New note button
        newNoteBtn.addEventListener('click', createNewNote);
        emptyStateBtn.addEventListener('click', createNewNote);
        
        // Save note button
        saveNoteBtn.addEventListener('click', saveNote);
        
        // Cancel button
        cancelNoteBtn.addEventListener('click', cancelEdit);
        
        // Delete button
        deleteNoteBtn.addEventListener('click', deleteNote);
        
        // Search input
        searchInput.addEventListener('input', function() {
            searchTerm = this.value.trim();
            renderNotes();
        });
        
        // Category filters
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Remove active class from all filters
                categoryFilters.forEach(f => f.classList.remove('active', 'bg-primary', 'text-white'));
                categoryFilters.forEach(f => f.classList.add('bg-gray-200', 'hover:bg-gray-300'));
                
                // Add active class to clicked filter
                this.classList.add('active', 'bg-primary', 'text-white');
                this.classList.remove('bg-gray-200', 'hover:bg-gray-300');
                
                // Update current filter
                currentFilter = this.dataset.category;
                renderNotes();
            });
        });
    }

    // Create a new note
    function createNewNote() {
        // Reset the editor
        noteTitle.value = '';
        noteCategory.value = '';
        noteContent.value = '';
        currentNoteId = null;
        
        // Show the editor and hide delete button
        noteEditor.classList.remove('hidden');
        deleteNoteBtn.classList.add('hidden');
        
        // Focus on the title input
        noteTitle.focus();
    }

    // Open an existing note for editing
    function openNote(noteId) {
        const note = notes.find(n => n.id === noteId);
        if (!note) return;
        
        // Populate the editor
        noteTitle.value = note.title;
        noteCategory.value = note.category || '';
        noteContent.value = note.content;
        currentNoteId = note.id;
        
        // Show the editor and delete button
        noteEditor.classList.remove('hidden');
        deleteNoteBtn.classList.remove('hidden');
        
        // Focus on the title input
        noteTitle.focus();
    }

    // Save the current note
    function saveNote() {
        // Validate title
        if (!noteTitle.value.trim()) {
            alert('Please enter a title for your note');
            noteTitle.focus();
            return;
        }
        
        const now = Date.now();
        
        if (currentNoteId) {
            // Update existing note
            const noteIndex = notes.findIndex(n => n.id === currentNoteId);
            if (noteIndex !== -1) {
                notes[noteIndex] = {
                    ...notes[noteIndex],
                    title: noteTitle.value.trim(),
                    category: noteCategory.value,
                    content: noteContent.value,
                    lastModified: now
                };
            }
        } else {
            // Create new note
            const newNote = {
                id: 'note_' + now,
                title: noteTitle.value.trim(),
                category: noteCategory.value,
                content: noteContent.value,
                created: now,
                lastModified: now
            };
            notes.push(newNote);
        }
        
        // Save to localStorage and update UI
        saveNotesToLocalStorage();
        renderNotes();
        
        // Hide the editor
        noteEditor.classList.add('hidden');
        currentNoteId = null;
    }

    // Cancel editing
    function cancelEdit() {
        noteEditor.classList.add('hidden');
        currentNoteId = null;
    }

    // Delete the current note
    function deleteNote() {
        if (!currentNoteId) return;
        
        if (confirm('Are you sure you want to delete this note?')) {
            notes = notes.filter(note => note.id !== currentNoteId);
            saveNotesToLocalStorage();
            renderNotes();
            noteEditor.classList.add('hidden');
            currentNoteId = null;
            
            if (notes.length === 0) {
                emptyState.classList.remove('hidden');
            }
        }
    }

    // Initialize the 3D tool icon
    function initToolIcon() {
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const iconContainer = document.getElementById('tool-3d-icon');
            if (iconContainer) {
                Tool3DIcon.init(iconContainer, 'note');
            }
        }
    }

    // Initialize the app
    initNoteApp();
});
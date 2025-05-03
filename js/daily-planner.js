/**
 * Daily Planner - JavaScript functionality
 * Provides interactive calendar with event scheduling capabilities
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const eventForm = document.getElementById('event-form');
    const selectedDateElement = document.getElementById('selected-date');
    const eventTitleInput = document.getElementById('event-title');
    const eventTimeInput = document.getElementById('event-time');
    const eventDescriptionInput = document.getElementById('event-description');
    const saveEventBtn = document.getElementById('save-event');
    const cancelEventBtn = document.getElementById('cancel-event');
    const eventsContainer = document.getElementById('events-container');
    const eventsDateElement = document.getElementById('events-date');
    const eventsList = document.getElementById('events-list');
    const addEventBtn = document.getElementById('add-event-btn');
    const closeEventsBtn = document.getElementById('close-events-btn');
    const emptyState = document.getElementById('empty-state');

    // State variables
    let currentDate = new Date();
    let selectedDate = null;
    let events = {};

    // Initialize the calendar
    function initCalendar() {
        loadEventsFromLocalStorage();
        renderCalendar();
        setupEventListeners();
    }

    // Render the calendar for the current month
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update the month and year display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;
        
        // Clear the calendar grid
        calendarGrid.innerHTML = '';
        
        // Get the first day of the month and the number of days in the month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'h-24 bg-gray-100 rounded-md p-1';
            calendarGrid.appendChild(emptyCell);
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateCell = document.createElement('div');
            dateCell.className = 'h-24 bg-white border border-gray-200 rounded-md p-1 hover:bg-purple-50 transition-colors cursor-pointer relative';
            
            // Check if this is today's date
            const today = new Date();
            if (today.getDate() === day && today.getMonth() === month && today.getFullYear() === year) {
                dateCell.classList.add('border-purple-500', 'border-2');
            }
            
            // Create the date number element
            const dateNumber = document.createElement('div');
            dateNumber.className = 'text-right font-semibold';
            dateNumber.textContent = day;
            dateCell.appendChild(dateNumber);
            
            // Add event indicators if there are events on this day
            const dateString = formatDateString(year, month, day);
            if (events[dateString] && events[dateString].length > 0) {
                const eventCount = Math.min(events[dateString].length, 3);
                const eventIndicator = document.createElement('div');
                eventIndicator.className = 'mt-1';
                
                for (let i = 0; i < eventCount; i++) {
                    const indicator = document.createElement('div');
                    indicator.className = 'bg-purple-500 text-white text-xs rounded px-1 py-0.5 mb-0.5 truncate';
                    indicator.textContent = events[dateString][i].title;
                    eventIndicator.appendChild(indicator);
                }
                
                if (events[dateString].length > 3) {
                    const moreIndicator = document.createElement('div');
                    moreIndicator.className = 'text-xs text-gray-500';
                    moreIndicator.textContent = `+${events[dateString].length - 3} more`;
                    eventIndicator.appendChild(moreIndicator);
                }
                
                dateCell.appendChild(eventIndicator);
            }
            
            // Add click event to show events for this day
            dateCell.addEventListener('click', () => {
                selectedDate = new Date(year, month, day);
                showEventsForDate(dateString);
            });
            
            calendarGrid.appendChild(dateCell);
        }
    }

    // Format date as YYYY-MM-DD for storage
    function formatDateString(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // Format date for display
    function formatDateForDisplay(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Show events for a specific date
    function showEventsForDate(dateString) {
        // Hide event form if it's open
        eventForm.classList.add('hidden');
        
        // Update the selected date display
        eventsDateElement.textContent = formatDateForDisplay(selectedDate);
        
        // Clear the events list
        eventsList.innerHTML = '';
        
        // Check if there are events for this date
        if (events[dateString] && events[dateString].length > 0) {
            // Sort events by time
            events[dateString].sort((a, b) => {
                if (!a.time) return 1;
                if (!b.time) return -1;
                return a.time.localeCompare(b.time);
            });
            
            // Add each event to the list
            events[dateString].forEach((event, index) => {
                const eventItem = document.createElement('div');
                eventItem.className = 'bg-white border border-gray-200 rounded-md p-3 hover:shadow-md transition-shadow';
                
                const eventHeader = document.createElement('div');
                eventHeader.className = 'flex justify-between items-start';
                
                const eventTitle = document.createElement('h4');
                eventTitle.className = 'font-semibold text-lg';
                eventTitle.textContent = event.title;
                
                const eventActions = document.createElement('div');
                eventActions.className = 'flex space-x-1';
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'text-red-500 hover:text-red-700';
                deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>';
                deleteBtn.addEventListener('click', () => deleteEvent(dateString, index));
                
                eventActions.appendChild(deleteBtn);
                eventHeader.appendChild(eventTitle);
                eventHeader.appendChild(eventActions);
                eventItem.appendChild(eventHeader);
                
                if (event.time) {
                    const eventTime = document.createElement('div');
                    eventTime.className = 'text-sm text-gray-600 mt-1';
                    eventTime.textContent = formatTime(event.time);
                    eventItem.appendChild(eventTime);
                }
                
                if (event.description) {
                    const eventDescription = document.createElement('div');
                    eventDescription.className = 'mt-2 text-gray-700';
                    eventDescription.textContent = event.description;
                    eventItem.appendChild(eventDescription);
                }
                
                eventsList.appendChild(eventItem);
            });
            
            emptyState.classList.add('hidden');
        } else {
            // Show empty state
            emptyState.classList.remove('hidden');
        }
        
        // Show the events container
        eventsContainer.classList.remove('hidden');
    }

    // Format time for display
    function formatTime(timeString) {
        if (!timeString) return '';
        
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        
        return `${displayHour}:${minutes} ${period}`;
    }

    // Show the event form for adding a new event
    function showEventForm() {
        // Clear form inputs
        eventTitleInput.value = '';
        eventTimeInput.value = '';
        eventDescriptionInput.value = '';
        
        // Update the selected date display
        selectedDateElement.textContent = formatDateForDisplay(selectedDate);
        
        // Hide events container and show form
        eventsContainer.classList.add('hidden');
        eventForm.classList.remove('hidden');
    }

    // Save a new event
    function saveEvent() {
        const title = eventTitleInput.value.trim();
        if (!title) {
            alert('Please enter an event title');
            return;
        }
        
        const dateString = formatDateString(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
        );
        
        // Create the event object
        const newEvent = {
            title: title,
            time: eventTimeInput.value,
            description: eventDescriptionInput.value.trim()
        };
        
        // Add the event to the events object
        if (!events[dateString]) {
            events[dateString] = [];
        }
        events[dateString].push(newEvent);
        
        // Save to localStorage and update the UI
        saveEventsToLocalStorage();
        renderCalendar();
        showEventsForDate(dateString);
    }

    // Delete an event
    function deleteEvent(dateString, index) {
        if (confirm('Are you sure you want to delete this event?')) {
            events[dateString].splice(index, 1);
            
            // If there are no more events for this date, remove the date key
            if (events[dateString].length === 0) {
                delete events[dateString];
            }
            
            // Save to localStorage and update the UI
            saveEventsToLocalStorage();
            renderCalendar();
            
            // If there are still events for this date, show them
            if (events[dateString] && events[dateString].length > 0) {
                showEventsForDate(dateString);
            } else {
                // Otherwise, hide the events container
                eventsContainer.classList.add('hidden');
                emptyState.classList.remove('hidden');
            }
        }
    }

    // Save events to localStorage
    function saveEventsToLocalStorage() {
        localStorage.setItem('daily-planner-events', JSON.stringify(events));
    }

    // Load events from localStorage
    function loadEventsFromLocalStorage() {
        const storedEvents = localStorage.getItem('daily-planner-events');
        if (storedEvents) {
            events = JSON.parse(storedEvents);
        }
    }

    // Set up event listeners
    function setupEventListeners() {
        // Previous month button
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        
        // Next month button
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
        
        // Add event button
        addEventBtn.addEventListener('click', showEventForm);
        
        // Close events button
        closeEventsBtn.addEventListener('click', () => {
            eventsContainer.classList.add('hidden');
        });
        
        // Save event button
        saveEventBtn.addEventListener('click', saveEvent);
        
        // Cancel event button
        cancelEventBtn.addEventListener('click', () => {
            eventForm.classList.add('hidden');
            eventsContainer.classList.remove('hidden');
        });
    }

    // Initialize the calendar
    initCalendar();
});
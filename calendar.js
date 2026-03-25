/**
 * SB STAR LAWN - Booking Management System
 * Calendar module for handling calendar display and event rendering
 */

import { showBookingDetails } from './ui.js';

// State variables
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let events = [];

/**
 * Initialize calendar
 */
function initCalendar() {
    // Get DOM elements
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const calTitle = document.getElementById('calTitle');
    const calGrid = document.getElementById('calGrid');
    
    // Add event listeners for month navigation
    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
        
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }
    
    // Initial render
    renderCalendar();
}

/**
 * Render calendar for current month/year
 */
function renderCalendar() {
    const calTitle = document.getElementById('calTitle');
    const calGrid = document.getElementById('calGrid');
    
    if (!calTitle || !calGrid) return;
    
    // Set month/year title
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    calTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Clear grid
    calGrid.innerHTML = '';
    
    // Add day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'cal-day';
        dayEl.textContent = day;
        calGrid.appendChild(dayEl);
    });
    
    // Get first day of month and total days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Get days from previous month
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    
    // Add days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayEl = document.createElement('div');
        dayEl.className = 'cal-cell muted';
        dayEl.textContent = prevMonthDays - i;
        calGrid.appendChild(dayEl);
    }
    
    // Add days for current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'cal-cell';
        dayEl.textContent = day;
        
        // Check if there are events on this day
        const date = new Date(currentYear, currentMonth, day);
        const dayEvents = getEventsForDate(date);
        
        if (dayEvents.length > 0) {
            // Add dot indicator
            const dot = document.createElement('div');
            dot.className = 'cal-dot';
            dayEl.appendChild(dot);
            
            // Add data attribute for events
            dayEl.dataset.events = JSON.stringify(dayEvents);
            
            // Add click handler to show events
            dayEl.addEventListener('click', () => showEventsForDay(dayEvents));
        }
        
        // Highlight today
        const today = new Date();
        if (day === today.getDate() && 
            currentMonth === today.getMonth() && 
            currentYear === today.getFullYear()) {
            dayEl.style.backgroundColor = '#1e40af';
            dayEl.style.color = '#fff';
        }
        
        calGrid.appendChild(dayEl);
    }
    
    // Add days from next month to fill grid
    const totalCells = dayNames.length * 6; // 6 rows max
    const remainingCells = totalCells - (firstDay + daysInMonth);
    
    for (let day = 1; day <= remainingCells; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'cal-cell muted';
        dayEl.textContent = day;
        calGrid.appendChild(dayEl);
    }
}

/**
 * Get events for a specific date
 * @param {Date} date - Date to check
 * @returns {Array} - Events for the date
 */
function getEventsForDate(date) {
    if (!events || events.length === 0) return [];
    
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    return events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toISOString().split('T')[0] === dateStr;
    });
}

/**
 * Show events for a specific day
 * @param {Array} dayEvents - Events for the day
 */
function showEventsForDay(dayEvents) {
    if (!dayEvents || dayEvents.length === 0) return;
    
    // If only one event, show details directly
    if (dayEvents.length === 1) {
        showBookingDetails(dayEvents[0]);
        return;
    }
    
    // If multiple events, show list
    let content = '<ul class="modal-list">';
    
    dayEvents.forEach((event, index) => {
        content += `
            <li data-event-id="${event.id}" style="cursor: pointer;">
                <span class="sr-no">${index + 1}.</span>
                <i class="fa-solid fa-calendar-day"></i>
                <span>
                    <strong>${event.name}</strong><br>
                    ${event.functionType} - ${event.session} Session
                </span>
            </li>
        `;
    });
    
    content += '</ul>';
    
    // Show modal with events
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-title">
                <span><i class="fa-solid fa-calendar-day"></i> Events on ${new Date(dayEvents[0].date).toLocaleDateString()}</span>
                <button class="modal-close">&times;</button>
            </div>
            ${content}
        </div>
    `;
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Add click handlers for each event
    modal.querySelectorAll('li[data-event-id]').forEach(li => {
        li.addEventListener('click', () => {
            const eventId = li.dataset.eventId;
            const event = dayEvents.find(e => e.id === eventId);
            if (event) {
                modal.remove();
                showBookingDetails(event);
            }
        });
    });
    
    document.body.appendChild(modal);
}

/**
 * Render events in the calendar
 * @param {Array} eventData - Events to render
 */
function renderEvents(eventData) {
    // Update events array
    events = eventData || [];
    
    // Update calendar to show event indicators
    renderCalendar();
    
    // Render upcoming events list
    renderUpcomingEvents();
}

/**
 * Render upcoming events in the events list
 */
function renderUpcomingEvents() {
    const eventList = document.getElementById('bookingFormEventList'); // Target the list within the booking form section
    if (!eventList) return;
    
    // Clear list
    eventList.innerHTML = '';
    
    if (!events || events.length === 0) {
        eventList.innerHTML = '<p>No upcoming events</p>';
        return;
    }
    
    // Sort events by date (ascending)
    const sortedEvents = [...events].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter upcoming events (today and future)
    const upcomingEvents = sortedEvents.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
    });
    
    // Limit to 5 events
    const eventsToShow = upcomingEvents.slice(0, 5);
    
    if (eventsToShow.length === 0) {
        eventList.innerHTML = '<p>No upcoming events</p>';
        return;
    }
    
    // Create event items
    eventsToShow.forEach(event => {
        const eventDate = new Date(event.date);
        const isToday = eventDate.toDateString() === today.toDateString();
        
        const eventEl = document.createElement('div');
        eventEl.className = 'card';
        eventEl.style.padding = '12px';
        eventEl.style.marginBottom = '10px';
        eventEl.style.cursor = 'pointer';
        
        // Determine priority tag
        let tagClass = 'low';
        if (isToday) {
            tagClass = 'high';
        } else if (eventDate < new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) {
            tagClass = 'medium';
        }
        
        eventEl.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${event.name}</strong>
                    <div style="font-size: 14px; color: #64748b;">
                        ${event.functionType} - ${event.session} Session
                    </div>
                </div>
                <div>
                    <span class="tag ${tagClass}">${isToday ? 'Today' : eventDate.toLocaleDateString()}</span>
                </div>
            </div>
        `;
        
        // Add click handler to show details
        eventEl.addEventListener('click', () => {
            showBookingDetails(event);
        });
        
        eventList.appendChild(eventEl);
    });
    
    // Add "View All" button if there are more events
    if (upcomingEvents.length > 5) {
        const viewAllBtn = document.createElement('button');
        viewAllBtn.className = 'btn secondary';
        viewAllBtn.style.width = '100%';
        viewAllBtn.style.marginTop = '10px';
        viewAllBtn.innerHTML = `View All (${upcomingEvents.length})`;
        
        viewAllBtn.addEventListener('click', () => {
            showAllEvents(upcomingEvents);
        });
        
        eventList.appendChild(viewAllBtn);
    }
}

/**
 * Show all events in a modal
 * @param {Array} eventsList - Events to show
 */
function showAllEvents(eventsList) {
    let content = '<div class="list" style="max-height: 60vh; overflow-y: auto;">';
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    eventsList.forEach(event => {
        const eventDate = new Date(event.date);
        const isToday = eventDate.toDateString() === today.toDateString();
        
        // Determine priority tag
        let tagClass = 'low';
        if (isToday) {
            tagClass = 'high';
        } else if (eventDate < new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) {
            tagClass = 'medium';
        }
        
        content += `
            <div class="card" style="padding: 12px; margin-bottom: 10px; cursor: pointer;" data-event-id="${event.id}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${event.name}</strong>
                        <div style="font-size: 14px; color: #64748b;">
                            ${event.functionType} - ${event.session} Session
                        </div>
                    </div>
                    <div>
                        <span class="tag ${tagClass}">${isToday ? 'Today' : eventDate.toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    content += '</div>';
    
    // Show modal with events
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-title">
                <span><i class="fa-solid fa-calendar-check"></i> All Upcoming Events</span>
                <button class="modal-close">&times;</button>
            </div>
            ${content}
        </div>
    `;
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Add click handlers for each event
    modal.querySelectorAll('[data-event-id]').forEach(el => {
        el.addEventListener('click', () => {
            const eventId = el.dataset.eventId;
            const event = eventsList.find(e => e.id === eventId);
            if (event) {
                modal.remove();
                showBookingDetails(event);
            }
        });
    });
    
    document.body.appendChild(modal);
}

/**
 * Filter events based on search criteria
 * @param {Object} filters - Search filters
 * @returns {Array} - Filtered events
 */
function filterEvents(filters) {
    const { query, type, dateFrom, dateTo } = filters;
    
    return events.filter(event => {
        // Filter by query (name or phone)
        if (query && !event.name.toLowerCase().includes(query.toLowerCase()) && 
            !event.phone.includes(query)) {
            return false;
        }
        
        // Filter by type
        if (type && event.functionType !== type) {
            return false;
        }
        
        // Filter by date range
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            fromDate.setHours(0, 0, 0, 0);
            if (eventDate < fromDate) {
                return false;
            }
        }
        
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(0, 0, 0, 0);
            if (eventDate > toDate) {
                return false;
            }
        }
        
        return true;
    });
}

// Export functions
export {
    initCalendar,
    renderCalendar,
    renderEvents,
    filterEvents,
    showAllEvents
};
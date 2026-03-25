/**
 * SB STAR LAWN - Booking Management System
 * Main JavaScript file that initializes the application
 */

// Import modules
import { apiRequest } from './api.js';
import { saveToLocalStorage, getFromLocalStorage, syncWithServer } from './storage.js';
import { initUI, showToast, showModal } from './ui.js';
import { initCalendar, renderEvents } from './calendar.js';
import { initStyles } from './styles.js';
import { debounce, formatCurrency, formatDate, sanitizeHTML, exportToCSV, lazyLoadImages } from './utility.js';

// Constants
const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api';

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize styles
    initStyles();
    
    // Initialize UI components
    initUI();
    
    // Initialize calendar
    initCalendar();
    
    // Load bookings (first from localStorage, then from server)
    loadBookings();
    
    // Setup form handlers
    setupFormHandlers();
    
    // Check online status and sync if needed
    window.addEventListener('online', () => {
        showToast('You are back online! Syncing data...', 'success');
        syncWithServer();
    });
    
    window.addEventListener('offline', () => {
        showToast('You are offline. Changes will be saved locally.', 'warning');
    });
});

/**
 * Load bookings from localStorage first, then from server
 */
async function loadBookings() {
    // First try to get from localStorage
    const localBookings = getFromLocalStorage('bookings');
    if (localBookings && localBookings.length > 0) {
        renderEvents(localBookings);
    }
    
    // Then fetch from server
    try {
        const bookings = await apiRequest(`${API_BASE_URL}/bookings`, 'GET');
        renderEvents(bookings);
        // Update localStorage with latest data
        saveToLocalStorage('bookings', bookings);
    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        showToast('Failed to fetch bookings from server', 'error');
    }
}

/**
 * Setup form handlers for booking form
 */
function setupFormHandlers() {
    const bookingForm = document.getElementById('bookingForm');
    const totalAmountInput = document.getElementById('totalAmount');
    const advanceInput = document.getElementById('advance');
    const pendingInput = document.getElementById('pending');
    const paymentModeSelect = document.getElementById('paymentMode');
    const qrSection = document.getElementById('qrSection');
    
    // Calculate pending amount in real-time with debounce for better performance
    const debouncedCalculate = debounce(calculatePendingAmount, 300);
    [totalAmountInput, advanceInput].forEach(input => {
        input.addEventListener('input', debouncedCalculate);
    });
    
    // Show/hide QR code based on payment mode
    paymentModeSelect.addEventListener('change', () => {
        qrSection.style.display = paymentModeSelect.value === 'upi' ? 'block' : 'none';
    });
    
    // Real-time field validation
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const dateInput = document.getElementById('date');
    
    if (nameInput) {
        nameInput.addEventListener('blur', () => {
            validateField(nameInput, value => value.trim().length >= 3, 
                'Name must be at least 3 characters', 'nameHint');
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', () => {
            validateField(phoneInput, value => /^\d{10}$/.test(value), 
                'Please enter a valid 10-digit phone number', 'phoneHint');
        });
    }
    
    if (dateInput) {
        dateInput.addEventListener('change', () => {
            validateField(dateInput, value => !!value, 
                'Please select a date', 'dateHint');
        });
    }
    
    if (totalAmountInput) {
        totalAmountInput.addEventListener('blur', () => {
            validateField(totalAmountInput, 
                value => !isNaN(parseFloat(value)) && parseFloat(value) > 0, 
                'Please enter a valid amount greater than 0', 'totalAmountHint');
        });
    }
    
    if (advanceInput) {
        advanceInput.addEventListener('blur', () => {
            const total = parseFloat(totalAmountInput.value) || 0;
            validateField(advanceInput, 
                value => !isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= total, 
                'Advance must be between 0 and total amount', 'advanceHint');
        });
    }
    
    // Form submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const formData = new FormData(bookingForm);
        const bookingData = Object.fromEntries(formData.entries());
        
        // Add pending amount
        bookingData.pending = pendingInput.value;
        
        try {
            const response = await apiRequest(`${API_BASE_URL}/bookings`, 'POST', bookingData);
            showToast('Booking saved successfully!', 'success');
            bookingForm.reset();
            
            // Refresh events
            loadBookings();
        } catch (error) {
            console.error('Failed to save booking:', error);
            
            // Save to localStorage if offline
            if (!navigator.onLine) {
                const localBookings = getFromLocalStorage('bookings') || [];
                bookingData.id = Date.now().toString(); // Temporary ID
                bookingData.pendingSync = true;
                localBookings.push(bookingData);
                saveToLocalStorage('bookings', localBookings);
                
                showToast('Booking saved locally. Will sync when online.', 'info');
                bookingForm.reset();
                
                // Refresh events from localStorage
                renderEvents(localBookings);
            } else {
                showToast('Failed to save booking. Please try again.', 'error');
            }
        }
    });
}

/**
 * Calculate pending amount based on total and advance
 */
function calculatePendingAmount() {
    const totalAmount = parseFloat(document.getElementById('totalAmount').value) || 0;
    const advanceAmount = parseFloat(document.getElementById('advance').value) || 0;
    const pendingInput = document.getElementById('pending');
    
    // Validate that advance is not greater than total
    if (advanceAmount > totalAmount) {
        document.getElementById('advanceHint').textContent = 'Advance cannot be greater than total amount';
        document.getElementById('advanceHint').className = 'hint err';
    } else {
        document.getElementById('advanceHint').textContent = '';
        document.getElementById('advanceHint').className = 'hint';
    }
    
    // Calculate pending amount
    const pendingAmount = totalAmount - advanceAmount;
    pendingInput.value = pendingAmount;
    
    // Visual feedback based on pending amount
    if (pendingAmount > totalAmount * 0.7) {
        pendingInput.style.color = '#ef4444'; // Red for high pending
    } else if (pendingAmount > totalAmount * 0.3) {
        pendingInput.style.color = '#f59e0b'; // Orange for medium pending
    } else {
        pendingInput.style.color = '#22c55e'; // Green for low pending
    }
}

/**
 * Validate a single form field
 * @param {HTMLInputElement} field - The field to validate
 * @param {Function} validationFn - Function that returns true if valid
 * @param {string} errorMessage - Error message to show if invalid
 * @param {string} hintId - ID of the hint element
 * @returns {boolean} - Whether the field is valid
 */
function validateField(field, validationFn, errorMessage, hintId) {
    const isValid = validationFn(field.value);
    const hintElement = document.getElementById(hintId);
    
    if (!isValid && hintElement) {
        hintElement.textContent = errorMessage;
        hintElement.className = 'hint err';
        field.classList.add('invalid');
    } else if (hintElement) {
        hintElement.textContent = '';
        hintElement.className = 'hint';
        field.classList.remove('invalid');
    }
    
    return isValid;
}

/**
 * Validate the booking form
 * @returns {boolean} True if form is valid, false otherwise
 */
function validateForm() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const totalAmount = parseFloat(document.getElementById('totalAmount').value) || 0;
    const advanceAmount = parseFloat(document.getElementById('advance').value) || 0;
    
    let isValid = true;
    
    // Reset hints
    document.querySelectorAll('.hint').forEach(hint => {
        hint.textContent = '';
        hint.className = 'hint';
    });
    
    // Validate name
    if (!validateField(
        document.getElementById('name'),
        value => value.trim().length >= 3,
        'Name is required (at least 3 characters)',
        'nameHint'
    )) {
        isValid = false;
    }
    
    // Validate phone
    if (!validateField(
        document.getElementById('phone'),
        value => /^\d{10}$/.test(value.trim()),
        'Please enter a valid 10-digit phone number',
        'phoneHint'
    )) {
        isValid = false;
    }
    
    // Validate date
    if (!validateField(
        document.getElementById('date'),
        value => !!value,
        'Date is required',
        'dateHint'
    )) {
        isValid = false;
    }
    
    // Validate amounts
    if (!validateField(
        document.getElementById('totalAmount'),
        value => parseFloat(value) > 0,
        'Total amount must be greater than zero',
        'totalAmountHint'
    )) {
        isValid = false;
    }
    
    if (!validateField(
        document.getElementById('advance'),
        value => parseFloat(value) >= 0 && parseFloat(value) <= totalAmount,
        'Advance cannot be greater than total amount',
        'advanceHint'
    )) {
        isValid = false;
    }
    
    return isValid;
}

// Export functions for use in other modules if needed
export {
    loadBookings,
    calculatePendingAmount,
    validateForm,
    API_BASE_URL
};
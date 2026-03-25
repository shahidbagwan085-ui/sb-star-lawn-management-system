/**
 * SB STAR LAWN - Booking Management System
 * Storage module for handling localStorage and data synchronization
 */

import { apiRequest } from './api.js';
import { showToast } from './ui.js';
import { API_BASE_URL } from './main.js';

// Constants
const STORAGE_KEYS = {
    BOOKINGS: 'sb_star_lawn_bookings',
    PENDING_SYNC: 'sb_star_lawn_pending_sync',
    LAST_SYNC: 'sb_star_lawn_last_sync'
};

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
function saveToLocalStorage(key, data) {
    try {
        const storageKey = STORAGE_KEYS[key.toUpperCase()] || key;
        localStorage.setItem(storageKey, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @returns {any} - Retrieved data or null if not found
 */
function getFromLocalStorage(key) {
    try {
        const storageKey = STORAGE_KEYS[key.toUpperCase()] || key;
        const data = localStorage.getItem(storageKey);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting from localStorage:', error);
        return null;
    }
}

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 */
function removeFromLocalStorage(key) {
    try {
        const storageKey = STORAGE_KEYS[key.toUpperCase()] || key;
        localStorage.removeItem(storageKey);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

/**
 * Sync pending bookings with server when online
 * @returns {Promise<boolean>} - True if sync was successful
 */
async function syncWithServer() {
    // Check if online
    if (!navigator.onLine) {
        console.log('Cannot sync while offline');
        return false;
    }
    
    // Get pending bookings
    const pendingBookings = getFromLocalStorage(STORAGE_KEYS.PENDING_SYNC) || [];
    
    if (pendingBookings.length === 0) {
        console.log('No pending bookings to sync');
        return true;
    }
    
    let syncSuccess = true;
    const successfulSyncs = [];
    
    // Try to sync each pending booking
    for (const booking of pendingBookings) {
        try {
            // Remove pendingSync flag
            const { pendingSync, ...bookingData } = booking;
            
            // Send to server
            await apiRequest(`${API_BASE_URL}/bookings`, 'POST', bookingData);
            
            // Mark as successfully synced
            successfulSyncs.push(booking);
        } catch (error) {
            console.error('Failed to sync booking:', booking, error);
            syncSuccess = false;
        }
    }
    
    // Remove successfully synced bookings from pending list
    if (successfulSyncs.length > 0) {
        const remainingPending = pendingBookings.filter(booking => 
            !successfulSyncs.some(synced => synced.id === booking.id)
        );
        
        saveToLocalStorage(STORAGE_KEYS.PENDING_SYNC, remainingPending);
        
        // Show toast with sync results
        showToast(
            `Synced ${successfulSyncs.length} of ${pendingBookings.length} bookings`,
            syncSuccess ? 'success' : 'warning'
        );
    }
    
    // Update last sync timestamp
    saveToLocalStorage(STORAGE_KEYS.LAST_SYNC, Date.now());
    
    return syncSuccess;
}

/**
 * Queue a booking for sync when online
 * @param {Object} booking - Booking data to queue
 */
function queueForSync(booking) {
    const pendingBookings = getFromLocalStorage(STORAGE_KEYS.PENDING_SYNC) || [];
    
    // Add pendingSync flag
    booking.pendingSync = true;
    
    // Add to pending list
    pendingBookings.push(booking);
    saveToLocalStorage(STORAGE_KEYS.PENDING_SYNC, pendingBookings);
    
    console.log('Booking queued for sync:', booking);
}

/**
 * Check if there are pending bookings to sync
 * @returns {number} - Number of pending bookings
 */
function getPendingSyncCount() {
    const pendingBookings = getFromLocalStorage(STORAGE_KEYS.PENDING_SYNC) || [];
    return pendingBookings.length;
}

// Export functions
export {
    saveToLocalStorage,
    getFromLocalStorage,
    removeFromLocalStorage,
    syncWithServer,
    queueForSync,
    getPendingSyncCount,
    STORAGE_KEYS
};
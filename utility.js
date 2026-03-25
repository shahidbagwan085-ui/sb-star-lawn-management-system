/**
 * SB STAR LAWN - Booking Management System
 * Utility functions module
 */

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @return {Function} - The debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @return {Function} - The throttled function
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Format date to a readable string
 * @param {Date|string} date - The date to format
 * @param {string} format - The format to use (default: 'dd/mm/yyyy')
 * @return {string} - The formatted date string
 */
function formatDate(date, format = 'dd/mm/yyyy') {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    switch (format.toLowerCase()) {
        case 'dd/mm/yyyy':
            return `${day}/${month}/${year}`;
        case 'mm/dd/yyyy':
            return `${month}/${day}/${year}`;
        case 'yyyy-mm-dd':
            return `${year}-${month}-${day}`;
        default:
            return `${day}/${month}/${year}`;
    }
}

/**
 * Format currency amount
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency symbol (default: '₹')
 * @return {string} - The formatted currency string
 */
function formatCurrency(amount, currency = '₹') {
    if (isNaN(amount)) return `${currency}0`;
    return `${currency}${parseFloat(amount).toFixed(2).replace(/\.00$/, '')}`;
}

/**
 * Generate a unique ID
 * @return {string} - A unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Check if the device is mobile
 * @return {boolean} - True if the device is mobile
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Lazy load images
 * @param {string} selector - The CSS selector for images to lazy load
 */
function lazyLoadImages(selector = 'img[data-src]') {
    const images = document.querySelectorAll(selector);
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

/**
 * Export data to CSV
 * @param {Array} data - Array of objects to export
 * @param {string} filename - The filename for the CSV
 */
function exportToCSV(data, filename = 'export.csv') {
    if (!data || !data.length) {
        console.error('No data to export');
        return;
    }
    
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
        headers.join(','), // Header row
        ...data.map(row => {
            return headers.map(header => {
                // Handle special characters and commas in the data
                const cell = row[header] === null || row[header] === undefined ? '' : row[header];
                const cellStr = String(cell).replace(/"/g, '""');
                return `"${cellStr}"`;
            }).join(',');
        })
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} html - The HTML string to sanitize
 * @return {string} - The sanitized HTML
 */
function sanitizeHTML(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
}

/**
 * Get URL parameters as an object
 * @return {Object} - The URL parameters
 */
function getUrlParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    
    return params;
}

// Export functions
export {
    debounce,
    throttle,
    formatDate,
    formatCurrency,
    generateId,
    isMobileDevice,
    lazyLoadImages,
    exportToCSV,
    sanitizeHTML,
    getUrlParams
};
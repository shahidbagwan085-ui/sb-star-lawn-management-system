/**
 * SB STAR LAWN - Booking Management System
 * API module for handling all API requests
 */

/**
 * Reusable API request function with error handling and retry capability
 * @param {string} url - The API endpoint URL
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} data - Request payload for POST/PUT requests
 * @param {Object} options - Additional options (retries, headers)
 * @returns {Promise<any>} - Promise resolving to the API response
 */
async function apiRequest(url, method = 'GET', data = null, options = {}) {
    const {
        retries = 3,
        retryDelay = 1000,
        headers = {}
    } = options;
    
    // Default headers
    const requestHeaders = {
        'Content-Type': 'application/json',
        ...headers
    };
    
    // Request options
    const requestOptions = {
        method,
        headers: requestHeaders,
        credentials: 'same-origin'
    };
    
    // Add body for POST/PUT requests
    if (data && (method === 'POST' || method === 'PUT')) {
        requestOptions.body = JSON.stringify(sanitizeData(data));
    }
    
    // Retry logic
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, requestOptions);
            
            // Handle non-2xx responses
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: `HTTP error! Status: ${response.status}`
                }));
                
                throw new Error(
                    errorData.message || `Request failed with status ${response.status}`
                );
            }
            
            // Parse and return response
            return await response.json();
        } catch (error) {
            lastError = error;
            
            // Don't retry on last attempt
            if (attempt === retries) {
                break;
            }
            
            // Exponential backoff
            const delay = retryDelay * Math.pow(2, attempt);
            console.log(`API request failed, retrying in ${delay}ms...`, error);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    // All retries failed
    console.error('API request failed after retries:', lastError);
    throw lastError;
}

/**
 * Sanitize data before sending to API
 * @param {Object} data - Data to sanitize
 * @returns {Object} - Sanitized data
 */
function sanitizeData(data) {
    const sanitized = {};
    
    // Process each field
    for (const [key, value] of Object.entries(data)) {
        // Skip null/undefined values
        if (value === null || value === undefined) {
            continue;
        }
        
        // Handle different data types
        if (typeof value === 'string') {
            // Trim strings and sanitize HTML
            sanitized[key] = sanitizeString(value.trim());
        } else if (typeof value === 'object' && !Array.isArray(value)) {
            // Recursively sanitize nested objects
            sanitized[key] = sanitizeData(value);
        } else {
            // Keep other types as is (numbers, booleans, arrays)
            sanitized[key] = value;
        }
    }
    
    return sanitized;
}

/**
 * Sanitize a string to prevent XSS attacks
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeString(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

// Export functions
export {
    apiRequest,
    sanitizeData,
    sanitizeString
};
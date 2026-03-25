/**
 * SB STAR LAWN - Booking Management System
 * UI module for handling user interface components
 */

import { getPendingSyncCount } from './storage.js';

// Constants
const TOAST_DURATION = 3000; // milliseconds

/**
 * Initialize UI components
 */
function initUI() {
    // Setup mobile menu toggle
    setupMobileMenu();
    
    // Setup utensils modal
    setupUtensilsModal();
    
    // Setup events toggle
    setupEventsToggle();
    
    // Setup scroll reveal
    setupScrollReveal();
    
    // Setup back to top button
    setupBackToTop();
    
    // Setup payment mode toggle
    setupPaymentModeToggle();
    
    // Create toast container if it doesn't exist
    if (!document.getElementById('toastContainer')) {
        createToastContainer();
    }
    
    // Create modal container if it doesn't exist
    if (!document.getElementById('modalContainer')) {
        createModalContainer();
    }
    
    // Show sync indicator if there are pending syncs
    updateSyncIndicator();
    
    // Setup search and filter UI
    setupSearchFilterUI();
}

/**
 * Setup mobile menu toggle
 */
function setupMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuBtn.innerHTML = mainNav.classList.contains('active') 
                ? '<i class="fa-solid fa-xmark"></i>' 
                : '<i class="fa-solid fa-bars"></i>';
        });
        
        // Close menu when clicking on a link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }
}

/**
 * Setup utensils modal
 */
function setupUtensilsModal() {
    const utensilsBtn = document.getElementById('utensilsBtn');
    
    if (utensilsBtn) {
        utensilsBtn.addEventListener('click', () => {
            // Kitchen utensils list
            const utensils = [
                'Plates (200)',
                'Glasses (200)',
                'Spoons (200)',
                'Forks (200)',
                'Serving Spoons (20)',
                'Serving Bowls (20)',
                'Water Jugs (20)',
                'Cooking Pots (10)',
                'Cooking Pans (5)',
                'Serving Trays (15)',
                'Knives (10)',
                'Cutting Boards (5)',
                'Measuring Cups (3)',
                'Ladles (10)'
            ];
            
            showModal({
                title: '<i class="fa-solid fa-utensils"></i> Kitchen Utensils',
                content: generateListHTML(utensils),
                showClose: true
            });
        });
    }
}

/**
 * Generate HTML list from array
 * @param {string[]} items - List items
 * @returns {string} - HTML list
 */
function generateListHTML(items) {
    let html = '<ul class="modal-list">';
    
    items.forEach((item, index) => {
        html += `
            <li>
                <span class="sr-no">${index + 1}.</span>
                <i class="fa-solid fa-check"></i>
                <span>${item}</span>
            </li>
        `;
    });
    
    html += '</ul>';
    return html;
}

/**
 * Setup events toggle
 */
function setupEventsToggle() {
    const toggleEventsBtn = document.getElementById('toggleEventsBtn');
    const eventList = document.getElementById('eventList');
    
    if (toggleEventsBtn && eventList) {
        toggleEventsBtn.addEventListener('click', () => {
            const isVisible = eventList.style.display !== 'none';
            eventList.style.display = isVisible ? 'none' : 'flex';
            toggleEventsBtn.innerHTML = isVisible 
                ? 'Show List <i class="fa-solid fa-chevron-down"></i>' 
                : 'Hide List <i class="fa-solid fa-chevron-up"></i>';
        });
    }
}

/**
 * Setup scroll reveal animation
 */
function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;
            
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('show');
            }
        });
    }
    
    // Check on load
    checkReveal();
    
    // Check on scroll
    window.addEventListener('scroll', checkReveal);
}

/**
 * Setup back to top button
 */
function setupBackToTop() {
    const toTopBtn = document.getElementById('toTop');
    
    if (!toTopBtn) {
        // Create button if it doesn't exist
        const btn = document.createElement('button');
        btn.id = 'toTop';
        btn.className = 'btn secondary';
        btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        document.body.appendChild(btn);
    }
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        const toTopBtn = document.getElementById('toTop');
        if (toTopBtn) {
            if (window.scrollY > 300) {
                toTopBtn.classList.add('show');
            } else {
                toTopBtn.classList.remove('show');
            }
        }
    });
}

/**
 * Setup payment mode toggle
 */
function setupPaymentModeToggle() {
    const paymentModeSelect = document.getElementById('paymentMode');
    const qrSection = document.getElementById('qrSection');
    
    if (paymentModeSelect && qrSection) {
        paymentModeSelect.addEventListener('change', () => {
            qrSection.style.display = paymentModeSelect.value === 'upi' ? 'block' : 'none';
        });
    }
}

/**
 * Create toast container
 */
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 300px;
    `;
    document.body.appendChild(container);
}

/**
 * Show toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = TOAST_DURATION) {
    const container = document.getElementById('toastContainer') || createToastContainer();
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.cssText = `
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 10px;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: toast-in 0.3s ease-out forwards;
        cursor: pointer;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            toast.style.backgroundColor = '#dcfce7';
            toast.style.color = '#166534';
            toast.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
            break;
        case 'error':
            toast.style.backgroundColor = '#fee2e2';
            toast.style.color = '#b91c1c';
            toast.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
            break;
        case 'warning':
            toast.style.backgroundColor = '#ffedd5';
            toast.style.color = '#c2410c';
            toast.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
            break;
        default: // info
            toast.style.backgroundColor = '#dbeafe';
            toast.style.color = '#1e40af';
            toast.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
    }
    
    // Add message
    toast.innerHTML += message;
    
    // Add close button
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        margin-left: auto;
        font-size: 18px;
        cursor: pointer;
    `;
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeToast(toast);
    });
    toast.appendChild(closeBtn);
    
    // Add to container
    container.appendChild(toast);
    
    // Auto-remove after duration
    setTimeout(() => removeToast(toast), duration);
    
    // Click to dismiss
    toast.addEventListener('click', () => removeToast(toast));
    
    return toast;
}

/**
 * Remove toast with animation
 * @param {HTMLElement} toast - Toast element to remove
 */
function removeToast(toast) {
    toast.style.animation = 'toast-out 0.3s ease-out forwards';
    setTimeout(() => toast.remove(), 300);
}

/**
 * Create modal container
 */
function createModalContainer() {
    // Add CSS for animations if not already present
    if (!document.getElementById('uiStyles')) {
        const style = document.createElement('style');
        style.id = 'uiStyles';
        style.textContent = `
            @keyframes toast-in {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes toast-out {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            @keyframes modal-in {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @keyframes modal-out {
                from { transform: scale(1); opacity: 1; }
                to { transform: scale(0.8); opacity: 0; }
            }
            .modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1001;
                padding: 16px;
            }
            .modal-content {
                background: #ffffff;
                padding: 24px;
                border-radius: 18px;
                box-shadow: 0 20px 50px rgba(0,0,0,.25);
                max-width: 500px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                animation: modal-in 0.3s ease-out;
            }
            .modal-title {
                font-size: 22px;
                font-weight: 700;
                margin: 0 0 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                color: #0f172a;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #64748b;
                transition: color 0.2s;
            }
            .modal-close:hover {
                color: #0f172a;
            }
            .modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 20px;
            }
            .sync-indicator {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: #ffedd5;
                color: #c2410c;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                font-weight: 700;
                margin-left: 5px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create modal container
    const container = document.createElement('div');
    container.id = 'modalContainer';
    document.body.appendChild(container);
    
    return container;
}

/**
 * Show modal dialog
 * @param {Object} options - Modal options
 * @param {string} options.title - Modal title
 * @param {string} options.content - Modal content HTML
 * @param {boolean} options.showClose - Show close button
 * @param {Function} options.onConfirm - Confirm button callback
 * @param {string} options.confirmText - Confirm button text
 * @param {Function} options.onCancel - Cancel button callback
 * @param {string} options.cancelText - Cancel button text
 * @param {string} options.size - Modal size (small, medium, large)
 * @returns {HTMLElement} - Modal element
 */
function showModal(options) {
    const {
        title = '',
        content = '',
        showClose = true,
        onConfirm = null,
        confirmText = 'Confirm',
        onCancel = null,
        cancelText = 'Cancel',
        size = 'medium'
    } = options;
    
    const container = document.getElementById('modalContainer') || createModalContainer();
    
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Set size
    switch (size) {
        case 'small':
            modalContent.style.maxWidth = '400px';
            break;
        case 'large':
            modalContent.style.maxWidth = '800px';
            break;
        default: // medium
            modalContent.style.maxWidth = '600px';
    }
    
    // Create modal title
    if (title) {
        const titleEl = document.createElement('div');
        titleEl.className = 'modal-title';
        titleEl.innerHTML = title;
        
        // Add close button
        if (showClose) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'modal-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => closeModal(overlay));
            titleEl.appendChild(closeBtn);
        }
        
        modalContent.appendChild(titleEl);
    }
    
    // Add content
    const contentEl = document.createElement('div');
    contentEl.className = 'modal-body';
    contentEl.innerHTML = content;
    modalContent.appendChild(contentEl);
    
    // Add footer with buttons if needed
    if (onConfirm || onCancel) {
        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        
        if (onCancel) {
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn secondary';
            cancelBtn.textContent = cancelText;
            cancelBtn.addEventListener('click', () => {
                onCancel();
                closeModal(overlay);
            });
            footer.appendChild(cancelBtn);
        }
        
        if (onConfirm) {
            const confirmBtn = document.createElement('button');
            confirmBtn.className = 'btn';
            confirmBtn.textContent = confirmText;
            confirmBtn.addEventListener('click', () => {
                onConfirm();
                closeModal(overlay);
            });
            footer.appendChild(confirmBtn);
        }
        
        modalContent.appendChild(footer);
    }
    
    // Add to DOM
    overlay.appendChild(modalContent);
    container.appendChild(overlay);
    
    // Close on background click if showClose is true
    if (showClose) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    }
    
    // Add keyboard support (Escape to close)
    const handleKeyDown = (e) => {
        if (e.key === 'Escape' && showClose) {
            closeModal(overlay);
            document.removeEventListener('keydown', handleKeyDown);
        }
    };
    document.addEventListener('keydown', handleKeyDown);
    
    return overlay;
}

/**
 * Close modal with animation
 * @param {HTMLElement} modal - Modal element to close
 */
function closeModal(modal) {
    const content = modal.querySelector('.modal-content');
    content.style.animation = 'modal-out 0.3s ease-out forwards';
    
    setTimeout(() => {
        modal.remove();
    }, 300);
}

/**
 * Update sync indicator based on pending sync count
 */
function updateSyncIndicator() {
    const pendingCount = getPendingSyncCount();
    
    // Remove existing indicator
    const existingIndicator = document.querySelector('.sync-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Add new indicator if needed
    if (pendingCount > 0) {
        const header = document.querySelector('header .brand');
        if (header) {
            const indicator = document.createElement('span');
            indicator.className = 'sync-indicator';
            indicator.textContent = pendingCount;
            indicator.title = `${pendingCount} booking(s) pending sync`;
            header.appendChild(indicator);
        }
    }
}

/**
 * Show booking details in a modal
 * @param {Object} booking - Booking data
 */
function showBookingDetails(booking) {
    const content = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
                <strong>Name:</strong>
                <p>${booking.name}</p>
            </div>
            <div>
                <strong>Phone:</strong>
                <p>${booking.phone}</p>
            </div>
            <div>
                <strong>Function Type:</strong>
                <p>${booking.functionType}</p>
            </div>
            <div>
                <strong>Date:</strong>
                <p>${new Date(booking.date).toLocaleDateString()}</p>
            </div>
            <div>
                <strong>Session:</strong>
                <p>${booking.session}</p>
            </div>
            <div>
                <strong>Payment Mode:</strong>
                <p>${booking.paymentMode}</p>
            </div>
            <div>
                <strong>Total Amount:</strong>
                <p>₹${booking.totalAmount}</p>
            </div>
            <div>
                <strong>Advance:</strong>
                <p>₹${booking.advance}</p>
            </div>
            <div>
                <strong>Pending:</strong>
                <p>₹${booking.pending}</p>
            </div>
        </div>
        ${booking.pendingSync ? '<p style="color: #c2410c; font-style: italic;">This booking is saved locally and will sync when online.</p>' : ''}
    `;
    
    showModal({
        title: `<i class="fa-solid fa-calendar-check"></i> Booking Details`,
        content,
        showClose: true,
        size: 'medium'
    });
}

/**
 * Show search and filter UI
 * @param {Function} onSearch - Search callback
 */
function showSearchFilter(onSearch) {
    const content = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
            <div>
                <label for="searchQuery">Search:</label>
                <input type="text" id="searchQuery" placeholder="Name or phone number" style="width: 100%">
            </div>
            <div>
                <label for="filterType">Filter by:</label>
                <select id="filterType" style="width: 100%">
                    <option value="">All Functions</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Reception">Reception</option>
                    <option value="Conference">Conference</option>
                    <option value="Naming Ceremony">Naming Ceremony</option>
                    <option value="Hakikah">Hakikah</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div>
                <label for="filterDateFrom">From Date:</label>
                <input type="date" id="filterDateFrom" style="width: 100%">
            </div>
            <div>
                <label for="filterDateTo">To Date:</label>
                <input type="date" id="filterDateTo" style="width: 100%">
            </div>
        </div>
    `;
    
    const modal = showModal({
        title: `<i class="fa-solid fa-search"></i> Search & Filter Bookings`,
        content,
        showClose: true,
        onConfirm: () => {
            const query = document.getElementById('searchQuery').value;
            const type = document.getElementById('filterType').value;
            const dateFrom = document.getElementById('filterDateFrom').value;
            const dateTo = document.getElementById('filterDateTo').value;
            
            onSearch({
                query,
                type,
                dateFrom,
                dateTo
            });
        },
        confirmText: 'Search',
        onCancel: () => {},
        cancelText: 'Cancel',
        size: 'medium'
    });
    
    // Focus search input
    setTimeout(() => {
        const searchInput = document.getElementById('searchQuery');
        if (searchInput) {
            searchInput.focus();
        }
    }, 100);
    
    return modal;
}

// Export functions
export {
    initUI,
    showToast,
    showModal,
    closeModal,
    updateSyncIndicator,
    showBookingDetails,
    showSearchFilter
};
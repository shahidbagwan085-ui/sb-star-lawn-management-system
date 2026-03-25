/**
 * SB STAR LAWN - Booking Management System
 * Styles module for dynamically adding CSS styles
 */

/**
 * Initialize styles
 */
function initStyles() {
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        /* Toast notifications */
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            max-width: 350px;
        }
        
        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .toast.success {
            border-left: 4px solid #22c55e;
        }
        
        .toast.error {
            border-left: 4px solid #ef4444;
        }
        
        .toast.warning {
            border-left: 4px solid #f59e0b;
        }
        
        .toast.info {
            border-left: 4px solid #3b82f6;
        }
        
        .toast i {
            font-size: 18px;
        }
        
        .toast.success i {
            color: #22c55e;
        }
        
        .toast.error i {
            color: #ef4444;
        }
        
        .toast.warning i {
            color: #f59e0b;
        }
        
        .toast.info i {
            color: #3b82f6;
        }
        
        /* Modal */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .modal-content {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalFadeIn 0.3s ease;
        }
        
        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .modal-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
            font-weight: 600;
            font-size: 18px;
        }
        
        .modal-title i {
            margin-right: 8px;
            color: var(--brand2);
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #64748b;
        }
        
        .modal-body {
            padding: 16px;
        }
        
        /* Booking details */
        .booking-details {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .detail-row {
            display: flex;
            align-items: flex-start;
        }
        
        .detail-row .label {
            width: 140px;
            font-weight: 600;
            color: #64748b;
        }
        
        .detail-row .value {
            flex: 1;
        }
        
        .detail-row.notes {
            flex-direction: column;
            gap: 8px;
        }
        
        .detail-row.notes .value {
            background: #f8fafc;
            padding: 10px;
            border-radius: 8px;
            white-space: pre-wrap;
        }
        
        .sync-warning {
            margin-top: 16px;
            padding: 10px;
            background: #fff7ed;
            border-left: 4px solid #f59e0b;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
        }
        
        .sync-warning i {
            color: #f59e0b;
        }
        
        /* Sync indicator */
        .sync-indicator {
            position: fixed;
            bottom: 20px;
            left: 20px;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
            z-index: 900;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .sync-indicator.online {
            background: #dcfce7;
            color: #166534;
        }
        
        .sync-indicator.offline {
            background: #fee2e2;
            color: #b91c1c;
        }
        
        /* Calendar styles */
        .cal-dot {
            position: absolute;
            bottom: 4px;
            left: 50%;
            transform: translateX(-50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--brand2);
        }
        
        .cal-cell {
            position: relative;
        }
        
        /* Form validation */
        .form-input.invalid {
            border-color: #ef4444;
        }
        
        .error-message {
            color: #ef4444;
            font-size: 12px;
            margin-top: 4px;
        }
        
        /* Modal list */
        .modal-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .modal-list li {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
            transition: background 0.2s ease;
        }
        
        .modal-list li:last-child {
            border-bottom: none;
        }
        
        .modal-list li:hover {
            background: #f8fafc;
        }
        
        .modal-list .sr-no {
            width: 24px;
            color: #64748b;
        }
        
        .modal-list i {
            color: var(--brand2);
            width: 20px;
            text-align: center;
        }
        
        /* Tags */
        .tag {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .tag.high {
            background: #fee2e2;
            color: #b91c1c;
        }
        
        .tag.medium {
            background: #fff7ed;
            color: #c2410c;
        }
        
        .tag.low {
            background: #dcfce7;
            color: #166534;
        }
        
        /* Search and filter */
        .search-filter-container {
            margin-bottom: 20px;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .modal-content {
                width: 95%;
            }
            
            .detail-row {
                flex-direction: column;
                gap: 4px;
            }
            
            .detail-row .label {
                width: 100%;
            }
        }
    `;
    
    // Add to document head
    document.head.appendChild(styleEl);
}

// Export functions
export { initStyles };
const express = require('express');
const cors = require('cors');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const bookingsFile = path.join(dataDir, 'bookings.xlsx');
const contactsFile = path.join(dataDir, 'contacts.xlsx');

// Initialize Excel files if they don't exist
function initializeExcelFiles() {
    // Initialize bookings file
    if (!fs.existsSync(bookingsFile)) {
        const bookingsWorkbook = XLSX.utils.book_new();
        const bookingsSheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(bookingsWorkbook, bookingsSheet, 'Bookings');
        XLSX.writeFile(bookingsWorkbook, bookingsFile);
        console.log('✅ Created bookings.xlsx file');
    }

    // Initialize contacts file
    if (!fs.existsSync(contactsFile)) {
        const contactsWorkbook = XLSX.utils.book_new();
        const contactsSheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(contactsWorkbook, contactsSheet, 'Contacts');
        XLSX.writeFile(contactsWorkbook, contactsFile);
        console.log('✅ Created contacts.xlsx file');
    }
}

// Helper functions for Excel operations
function readBookingsFromExcel() {
    try {
        if (!fs.existsSync(bookingsFile)) {
            return [];
        }
        const workbook = XLSX.readFile(bookingsFile);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet);
    } catch (error) {
        console.error('Error reading bookings from Excel:', error);
        return [];
    }
}

function writeBookingsToExcel(bookings) {
    try {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(bookings);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
        XLSX.writeFile(workbook, bookingsFile);
        console.log(`✅ Updated bookings.xlsx with ${bookings.length} records`);
        return true;
    } catch (error) {
        console.error('Error writing bookings to Excel:', error);
        return false;
    }
}

function readContactsFromExcel() {
    try {
        if (!fs.existsSync(contactsFile)) {
            return [];
        }
        const workbook = XLSX.readFile(contactsFile);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet);
    } catch (error) {
        console.error('Error reading contacts from Excel:', error);
        return [];
    }
}

function writeContactsToExcel(contacts) {
    try {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(contacts);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
        XLSX.writeFile(workbook, contactsFile);
        console.log(`✅ Updated contacts.xlsx with ${contacts.length} records`);
        return true;
    } catch (error) {
        console.error('Error writing contacts to Excel:', error);
        return false;
    }
}

// API Routes

// Get all bookings
app.get('/api/bookings', (req, res) => {
    try {
        const bookings = readBookingsFromExcel();
        res.json({
            success: true,
            data: bookings,
            count: bookings.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
});

// Get booking by ID
app.get('/api/bookings/:id', (req, res) => {
    try {
        const bookings = readBookingsFromExcel();
        const booking = bookings.find(b => b.id === req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
});

// Create new booking
app.post('/api/bookings', (req, res) => {
    try {
        const {
            name,
            phone,
            functionType,
            date,
            totalAmount,
            advance,
            advanceMode,
            pending,
            pendingMode,
            notes
        } = req.body;

        // Validation
        if (!name || !phone || !date || totalAmount === undefined || advance === undefined || pending === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const newBooking = {
            id: uuidv4(),
            bookingDate: new Date().toISOString().split('T')[0],
            name: name.trim(),
            phone: phone.trim(),
            type: functionType || 'Other',
            date: date,
            totalAmount: Number(totalAmount),
            advance: Number(advance),
            advanceMode: advanceMode || 'Cash',
            pending: Number(pending),
            pendingMode: pendingMode || null,
            pendingPaidOn: null,
            session: session || ''
        };

        const bookings = readBookingsFromExcel();
        bookings.push(newBooking);

        if (writeBookingsToExcel(bookings)) {
            res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                data: newBooking
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error saving booking to Excel'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
});

// Update booking
app.put('/api/bookings/:id', (req, res) => {
    try {
        const bookings = readBookingsFromExcel();
        const bookingIndex = bookings.findIndex(b => b.id === req.params.id);
        
        if (bookingIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        const updatedBooking = {
            ...bookings[bookingIndex],
            ...req.body,
            id: req.params.id // Ensure ID doesn't change
        };

        bookings[bookingIndex] = updatedBooking;

        if (writeBookingsToExcel(bookings)) {
            res.json({
                success: true,
                message: 'Booking updated successfully',
                data: updatedBooking
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error updating booking in Excel'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating booking',
            error: error.message
        });
    }
});

// Delete booking
app.delete('/api/bookings/:id', (req, res) => {
    try {
        const bookings = readBookingsFromExcel();
        const filteredBookings = bookings.filter(b => b.id !== req.params.id);
        
        if (bookings.length === filteredBookings.length) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (writeBookingsToExcel(filteredBookings)) {
            res.json({
                success: true,
                message: 'Booking deleted successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error deleting booking from Excel'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting booking',
            error: error.message
        });
    }
});

// Settle pending payment
app.patch('/api/bookings/:id/settle', (req, res) => {
    try {
        const { paymentMode } = req.body;
        
        if (!paymentMode) {
            return res.status(400).json({
                success: false,
                message: 'Payment mode is required'
            });
        }

        const bookings = readBookingsFromExcel();
        const bookingIndex = bookings.findIndex(b => b.id === req.params.id);
        
        if (bookingIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        const booking = bookings[bookingIndex];
        booking.pendingMode = paymentMode.trim();
        booking.pending = 0;
        booking.pendingPaidOn = new Date().toISOString().split('T')[0];

        if (writeBookingsToExcel(bookings)) {
            res.json({
                success: true,
                message: 'Payment settled successfully',
                data: booking
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error updating payment in Excel'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error settling payment',
            error: error.message
        });
    }
});

// Contact form submission
app.post('/api/contacts', (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const newContact = {
            id: uuidv4(),
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };

        const contacts = readContactsFromExcel();
        contacts.push(newContact);

        if (writeContactsToExcel(contacts)) {
            res.status(201).json({
                success: true,
                message: 'Contact message saved successfully',
                data: newContact
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error saving contact message'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing contact form',
            error: error.message
        });
    }
});

// Get all contacts
app.get('/api/contacts', (req, res) => {
    try {
        const contacts = readContactsFromExcel();
        res.json({
            success: true,
            data: contacts,
            count: contacts.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts',
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'SB STAR LAWN Backend API is running',
        timestamp: new Date().toISOString(),
        excelFiles: {
            bookings: fs.existsSync(bookingsFile),
            contacts: fs.existsSync(contactsFile)
        }
    });
});

// Serve static files (your frontend)
app.use(express.static(path.join(__dirname)));

// Initialize Excel files on startup
initializeExcelFiles();

// Start server
app.listen(PORT, () => {
    console.log(`🚀 SB STAR LAWN Backend Server running on port ${PORT}`);
    console.log(`📊 Excel files will be stored in: ${dataDir}`);
    console.log(`🌐 API endpoints available at: http://localhost:${PORT}/api`);
    console.log(`📱 Frontend available at: http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;

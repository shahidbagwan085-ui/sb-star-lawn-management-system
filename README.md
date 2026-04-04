# SB STAR LAWN - Complete Setup Guide

## 🎯 **Complete Process to Set Up Your Excel Data Storage System**

### **Step 1: Install Node.js**
1. Download Node.js from https://nodejs.org/
2. Install it on your computer
3. Open Command Prompt/Terminal and verify: `node --version`

### **Step 2: Install Dependencies**
Open Command Prompt in your project folder and run:
```bash
npm install
```

### **Step 3: Start Your Backend Server**
```bash
npm start
```

### **Step 4: Access Your Application**
- **Website**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health

---

## 📊 **Excel Files Created Automatically**

When you start the server, it will create:
- `data/bookings.xlsx` - All booking data
- `data/contacts.xlsx` - Contact form submissions

### **Excel File Structure:**

#### **Bookings.xlsx Columns:**
| Column | Description |
|--------|-------------|
| id | Unique booking ID |
| bookingDate | Date when booking was made |
| name | Customer name |
| phone | Customer phone number |
| type | Function type (Wedding, Birthday, etc.) |
| date | Event date |
| advance | Advance payment amount |
| advanceMode | Payment mode for advance |
| pending | Pending payment amount |
| pendingMode | Payment mode for pending (if settled) |
| pendingPaidOn | Date when pending was paid |
| notes | Additional notes |

#### **Contacts.xlsx Columns:**
| Column | Description |
|--------|-------------|
| id | Unique contact ID |
| name | Contact person name |
| email | Contact email |
| message | Contact message |
| date | Submission date |
| timestamp | Full timestamp |

---

## 🔧 **How It Works**

### **1. Booking Process:**
1. Customer fills booking form on your website
2. Data is sent to backend API
3. Backend saves data to `bookings.xlsx`
4. You can open Excel file to see all bookings

### **2. Contact Form Process:**
1. Customer submits contact form
2. Data is sent to backend API
3. Backend saves data to `contacts.xlsx`
4. You can open Excel file to see all inquiries

### **3. Payment Settlement:**
1. Click "Settle Payment" on any pending booking
2. Enter payment method (Cash, UPI, etc.)
3. Data is updated in Excel file
4. Booking shows as "Paid in Full"

---

## 📁 **File Structure After Setup**

```
SB STAR LOWA/
├── home.html              # Your main website
├── server.js              # Backend server
├── package.json           # Dependencies
├── data/                  # Excel files (created automatically)
│   ├── bookings.xlsx      # All booking data
│   └── contacts.xlsx      # Contact form data
└── README.md              # This guide
```

---

## 🚀 **Quick Start Commands**

```bash
# 1. Install dependencies
npm install

# 2. Start server
npm start

# 3. Open browser
# Go to: http://localhost:3000
```

---

## 📋 **API Endpoints Available**

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking
- `PATCH /api/bookings/:id/settle` - Settle payment
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - Get all contacts
- `GET /api/health` - Check server status

---

## 🔍 **Troubleshooting**

### **If server won't start:**
```bash
# Check if port 3000 is free
netstat -an | findstr :3000

# Kill process using port 3000
npx kill-port 3000
```

### **If Excel files aren't created:**
1. Check if `data/` folder exists
2. Check server console for error messages
3. Ensure you have write permissions

### **If website shows errors:**
1. Make sure server is running on port 3000
2. Check browser console for errors
3. Verify API_BASE_URL in your HTML file

---

## 📊 **Viewing Your Data**

### **Method 1: Open Excel Files Directly**
- Navigate to `data/` folder
- Open `bookings.xlsx` to see all bookings
- Open `contacts.xlsx` to see all contact submissions

### **Method 2: Use API**
- Visit: http://localhost:3000/api/bookings
- Visit: http://localhost:3000/api/contacts

---

## 🎉 **Success Indicators**

✅ **Server running**: Console shows "SB STAR LAWN Backend Server running"  
✅ **Excel files created**: `data/bookings.xlsx` and `data/contacts.xlsx` exist  
✅ **Website working**: http://localhost:3000 loads your website  
✅ **API working**: http://localhost:3000/api/health shows success message  

----

## 📞 **Support**

If you encounter any issues:
1. Check the console logs for error messages
2. Ensure all dependencies are installed
3. Verify Node.js is properly installed
4. Make sure port 3000 is available

---

**Your SB STAR LAWN booking system is now ready with Excel data storage! 🎊**


# AI Invoice Generator

AI Invoice Generator is a full-stack invoicing platform that helps freelancers and small businesses create, manage, and track invoices effortlessly — powered by Google Gemini AI for intelligent automation.

## Features

* User authentication and authorization
* Business profile creation and editing (auto-fills invoice details)
* Create, edit, delete, and filter invoices by status (Paid/Unpaid)
* AI-powered invoice generation from plain text (emails, chat messages, notes)
* AI-generated professional payment reminder emails for unpaid invoices
* AI-powered financial insights on the dashboard
* Print and download invoices as PDF
* Responsive and modern user interface

## Tech Stack

### Frontend

* React.js
* React Router
* Context API
* Tailwind CSS
* Axios
* React Hot Toast
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt

### AI

* Google Gemini AI

### Tools

* Git
* GitHub
* Postman

## Project Structure

```
AI-InvoiceGenerator/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── public/
│   └── package.json
│
└── backend/
    ├── routes/
    ├── models/
    ├── controllers/
    ├── middlewares/
    ├── config/
    └── server.js
```

## Getting Started

### 1. Clone the repository

```
git clone https://github.com/mitulgadhiya3706/AI-InvoiceGenerator.git
cd AI-InvoiceGenerator
```

### 2. Backend Setup

```
cd backend
npm install
npm run dev
```

Create a `.env` file in the backend:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup

```
cd frontend
npm install
npm run dev
```

Create a `.env` file in the frontend:

```
VITE_API_BASE_URL=http://localhost:5000
```

## Main Functionalities

**Authentication**
Users can sign up, log in, and securely access protected features using JWT-based authentication.

**Invoice Management**
Users can create, edit, delete, and filter invoices by status, with automatic subtotal, tax, and total calculations.

**AI Invoice Generation**
Users can paste plain text — such as a client email or message — and Gemini AI extracts client details and line items to instantly generate a structured invoice draft.

**AI Payment Reminders**
For any unpaid invoice, Gemini AI drafts a polite, professional reminder email that can be copied and sent to the client.

**AI Insights Dashboard**
Gemini AI analyzes invoice data to generate actionable business insights displayed directly on the dashboard.

**Profile Management**
Users can save their business details (name, address, contact info) so invoices are auto-filled with sender information.

**Print & Export**
Invoices can be printed or saved as PDF directly from the invoice detail page.

## API

The backend provides REST APIs for:

* Authentication
* User profile
* Invoices (CRUD + filtering)
* AI invoice parsing
* AI reminder email generation
* AI dashboard insights

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

## Author

Mitul Gadhiya

Live Demo: https://ai-invoice-generator-iota.vercel.app/

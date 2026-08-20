require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const connectDB = require('./config/database');
const { METHODS } = require("http");

const authRoutes = require("./routes/auth.routes");
const aiRoutes = require("./routes/ai.routes");
const invoiceRoutes = require("./routes/invoice.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",        
  process.env.CLIENT_URL,         
];

app.use(cors({
    origin: function (origin, callback) {
        // "!origin" allows tools like Postman/curl through (they send no origin header)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
}));


connectDB();

app.use(express.json());

app.use(authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/invoices", invoiceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
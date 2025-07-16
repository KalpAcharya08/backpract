const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const stockRoutes = require('./routes/stockRoutes');
const alertRoutes = require('./routes/alertRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
// Example in app.js or server.js
const predictionRoutes = require('./routes/prediction');
app.use('/api', predictionRoutes);

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stocks', stockRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
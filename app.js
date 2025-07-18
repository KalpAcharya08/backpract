const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const stockRoutes = require('./routes/stockRoutes');
const alertRoutes = require('./routes/alertRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
// Example in app.js or server.js
const predictionRoutes = require('./routes/prediction');
<<<<<<< HEAD
const paymentRoutes = require('./routes/payment');
app.use('/api', predictionRoutes);
=======
>>>>>>> 55e42af7bec561ba02a00dac7a0d877f4c12f446

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/predicts', predictionRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/users', userRoutes);

<<<<<<< HEAD
app.use('/api/payment', paymentRoutes);

module.exports = app;
=======
module.exports = app;
>>>>>>> 55e42af7bec561ba02a00dac7a0d877f4c12f446

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const initCronJobs = require('./src/services/cronService');

const adminRoutes = require('./src/routes/adminRoutes');
const clientRoutes = require('./src/routes/clientRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project4')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/client', clientRoutes);

// Serve Static Assets in Production
const path = require('path');

// Serve frontend build files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle React Routing (SPA) - Return index.html for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Init Cron
initCronJobs();

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

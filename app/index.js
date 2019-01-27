// Include libs
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Include services & middleware

const connectors = require('./api/connectors');
const cors = require('./api/middleware/cors');

// Include routes
const userRoutes = require('./api/routes/user');
const authRoutes = require('./api/routes/auth');

// Run services
const app = express();
connectors();

// Use middleware
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors);

// Init routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

// Error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;

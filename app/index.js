// Include libs
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Include services & middleware

const connectors = require('./api/connectors');
const cors = require('./api/middleware/cors');

// Include routes
const userRoutes = require('./api/routes/user');

// Run services
const app = express();
connectors();

// Init routes
app.use('/api/user', userRoutes);

// Use middleware
app.use(morgan('dev'));
app.use(cors);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        }
    })
});

module.exports = app;

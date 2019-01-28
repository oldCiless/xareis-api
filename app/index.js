// Include libs
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Include services & middleware
const connectors = require('./connectors');
const cors = require('./middleware/cors');
const jwt = require('./middleware/jwt');

// Include routes
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

// Run services
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server started on port ' + port);
});
connectors();

// Use middleware
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(cors);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(jwt);

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

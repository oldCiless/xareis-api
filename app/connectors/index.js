const mongooseConnector = require('./mongoose.connector');

function getMongoUri() {
    if (process.env.NODE_ENV === 'tests') {
        return process.env.MONGO_TESTS_URI;
    }
    return process.env.MONGO_URI;
}

async function connectorsInit() {
    try {
        await mongooseConnector(getMongoUri());
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = connectorsInit;

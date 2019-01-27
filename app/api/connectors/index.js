const mongooseConnector = require('./mongoose.connector');

async function connectorsInit() {
    try {
        await mongooseConnector(process.env.MONGO_URI);
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = connectorsInit;

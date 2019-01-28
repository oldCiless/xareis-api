const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

module.exports = (mongoUri) => {
    if (!mongoUri) {
        throw Error('Mongo uri is undefined');
    }

    return mongoose.connect(mongoUri).then((mongodb) => {
        console.log('Mongo connected');
        return mongodb;
    });
};

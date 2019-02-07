const mongoose = require('mongoose');

const ContractSchema = mongoose.Schema({
    type: {
        type: String,
    },
    id: {
        type: Number,
        unique: true,
    },
    main: {
        id: {
            type: Number,
        },
        sim: {
            type: String,
        },
        name: {
            type: String,
        },
    },
    status: {
        state: {
            type: Number,
        },
        enabled: {
            type: Boolean,
        },
        signal: {
            type: String,
        },
        timer: {
            type: Number,
        },
    },
    contract: {
        type: {
            type: String,
        },
        owner: {
            type: String,
        },
        region: {
            type: String,
        },
        address: {
            type: String,
        },
        chop: {
            type: String,
        },
        info: {
            type: String,
        },
    },
    geo: {
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        },
    },
    tech: {
        device: {
            type: String,
        },
        type: {
            type: String,
        },
        parser: {
            type: String,
        },
        modems: {
            sms: {
                type: Number,
            },
            voice: {
                type: String,
            },
            data: {
                type: String,
            },
        },
    },
});

module.exports = mongoose.model('Contract', ContractSchema);

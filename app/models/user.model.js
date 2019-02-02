const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const randomString = require('randomstring');

const UserSchema = mongoose.Schema(
    {
        phone: {
            type: String,
            required: 'Phone is required',
            unique: true,
            trim: true,
            validate: /(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?/
        },
        password: {
            type: String,
            required: 'Password is required',
            trim: true,
            validate: /[a-z\d]{6,100}/i
        },
        firstName: { type: String, required: 'First name is required', trim: true },
        lastName: { type: String, required: 'Last name is required', trim: true },
        avatar: { type: String, default: 'uploads\\\\avatars\\\\no_avatar.png' },
        access: { type: String, default: 'user' },
        confirmed: { type: Boolean, default: false },
        code: {
            code: { type: Number },
            expired: { type: Date }
        }
    },
    { timestamps: true }
);

UserSchema.statics.createFields = ['phone', 'password', 'firstName', 'lastName'];

UserSchema.statics.findOneWithPublicFields = function(params, callback) {
    return this.findOne(params, callback).select({
        code: 0,
        confirmed: 0,
        password: 0,
        _id: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0
    });
};

UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);

    next();
});

UserSchema.methods.comparePasswords = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.isVerified = function(code) {
    const currentDate = new Date();
    if (this.code.expired <= currentDate || this.code.code !== Number(code)) {
        return false;
    }
    return true;
};

UserSchema.methods.generateCode = function() {
    const code = randomString.generate({
        length: 6,
        charset: 'numeric'
    });

    const expiredDate = new Date().setMinutes(new Date().getMinutes() + 1);

    this.code.code = code;
    this.code.expired = expiredDate;
    this.save();

    return code;
};

UserSchema.methods.codeTimeout = function() {
    const currentDate = new Date();
    if (!this.code.code) {
        return false;
    } else if (currentDate >= this.code.expired) {
        return false;
    }
    return true;
};

UserSchema.methods.timeoutTime = function() {
    const currentDate = new Date();
    return Math.round((this.code.expired - currentDate) / 1000);
};

module.exports = mongoose.model('User', UserSchema);

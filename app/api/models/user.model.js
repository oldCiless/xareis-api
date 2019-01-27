const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const randomString = require('randomstring');

const UserSchema = mongoose.Schema({
    phone: { type: String, required: 'Phone is required', unique: true, trim: true },
    password: { type: String, required: 'Password is required', trim: true  },
    firstName: { type: String, required: 'First name is required', trim: true },
    lastName: { type: String, required: 'Last name is required', trim: true },
    avatar: { type: String, default: 'uploads\\\\avatars\\\\no_avatar.png' },
    access: { type: String, default: 'User' }
}, { timestamps: true });

UserSchema.statics.createFields = [
    'phone',
    'password',
    'firstName',
    'lastName'
];

UserSchema.statics.findOneWithPublicFields = function(params, callback) {
  return this.findOne(params, callback).select({
      password: 0,
      _id: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
  });
};

UserSchema.pre('save', function(next) {
    if (!this.isModified('password'))
        return next();

    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);

    next();
});

UserSchema.methods.comparePasswords = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);

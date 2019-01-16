var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = "require('../config').secret";
var config = "require('../config')";

var UserSchema = new mongoose.Schema({
    username: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'] },
    email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'] },
    role: { type: String, enum: ['admin', 'user'], default: 'user', lowercase: true, required: true },
    firstname: String,
    lastname: String,
    image: String,
    image: String,
    hash: String,
    salt: String
}, { timestamps: true });


UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateConfirmationUrl = function () {
    return `${config.FRONTEND_URL}/confirmation/${this.confirmationToken}`;
};

UserSchema.methods.generateResetPasswordLink = function () {
    return `${config.FRONTEND_URL}/reset_password/${this.generateResetPasswordToken()}`;
};

UserSchema.methods.generateResetPasswordToken = function () {
    return jwt.sign({
        id: this._id
    }, secret, { expiresIn: '1h' });
};



UserSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        role: this.role,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

UserSchema.methods.toAuthJSON = function () {
    return {
        username: this.username,
        role: this.role,
        email: this.email,
        token: this.generateJWT(),
        image: this.image
    };
};

UserSchema.methods.toProfileJSONFor = function (user) {
    return {
        username: this.username,
        role: this.role,
        image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    };
};

mongoose.model('User', UserSchema);

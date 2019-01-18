import mongoose from 'mongoose'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

let UserSchema = new mongoose.Schema({
    username: { type: String, lowercase: true, unique: true, required: true, index: true },
    email: { type: String, lowercase: true, unique: true, required: true, index: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user', lowercase: true, required: true },
    firstname: String,
    lastname: String,
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
    let token = jwt.sign({ id: this._id }, process.env.CONFIRMATION_EMAIL_SECRET, { expiresIn: '1h' });
    return `${process.env.FRONTEND_URL}/auth/confirm-email/${token}`;
};


UserSchema.methods.generateResetPasswordUrl = function () {
    let token = jwt.sign({ id: this._id }, process.env.RESET_PASSWORD_SECRET, { expiresIn: '1h' });
    return `${process.env.FRONTEND_URL}/auth/new-password/${token}`;
};

UserSchema.methods.generateJWT = function () {
    return jwt.sign({
        id: this._id,
        username: this.username
    }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

UserSchema.methods.fullname = function () {
    return `${this.firstname || ''} ${this.lastname || ''}`
};

UserSchema.methods.toAuthJSON = function () {
    return {
        username: this.username,
        email: this.email,
        isVerified: this.isVerified,
        fullname: this.fullname(),
        token: this.generateJWT(),
        image: this.image || 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Portrait_Placeholder_Square.png'
    };
};

UserSchema.methods.toJSON = function (user) {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        isVerified: this.isVerified,
        firstname: this.firstname,
        lastname: this.lastname,
        image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    };
};




mongoose.model('User', UserSchema);
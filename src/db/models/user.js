import mongoose from 'mongoose'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import moment from "moment";

let UserSchema = new mongoose.Schema({
    username: { type: String, lowercase: true, unique: true, required: true, index: true },
    email: { type: String, lowercase: true, unique: true, required: true, index: true },
    phonenumber: { type: String, unique: true, index: true },

    role: { type: String, enum: ['user', 'admin'], default: 'user', lowercase: true, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'male', lowercase: true, required: true },
    dob: { type: Date, default: moment.utc().format("YYYY-MM-DD") },

    firstname: String,
    lastname: String,
    image: { type: String, default: '/uploads/avatarHolder.png' },

    hash: String,
    salt: String,

    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },

    postNotification: { type: Boolean, default: false },
    peerNotification: { type: Boolean, default: false },
    privateMsgNotification: { type: Boolean, default: false },

    token: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserToken' }],
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
    }, process.env.JWT_SECRET, { expiresIn: '1y' });
};

UserSchema.methods.fullname = function () {
    return `${this.firstname || ''} ${this.lastname || ''}`
};

UserSchema.methods.toAuthJSON = function () {
    return {
        username: this.username,
        email: this.email,
        emailVerified: this.emailVerified,
        phoneVerified: this.phoneVerified,
        fullname: this.fullname(),
        token: this.generateJWT(),
        image: this.image
    };
};

UserSchema.methods.toJSON = function () {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        emailVerified: this.emailVerified,
        phoneVerified: this.phoneVerified,
        firstname: this.firstname,
        lastname: this.lastname,
        image: this.image
    };
};




mongoose.model('User', UserSchema);
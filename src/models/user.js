import mongoose from 'mongoose'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import config from '../config/config';
import * as mailer from '../mailer'

let UserSchema = new mongoose.Schema({
    username: { type: String, lowercase: true, unique: true, trim: true, required: true },
    email: { type: String, lowercase: true, unique: true, trim: true, required: true },

    fullName: { type: String, },
    avatar: { type: String, default: '/uploads/avatarHolder.png' },

    passwordHash: { type: String, },
    passwordSalt: { type: String, },

    verified: { type: Boolean, default: false },

    emailToken: { type: String, },
}, { timestamps: true, versionKey: false });

/** 
 * =====  Pre save hook =====
 * 
 * It will check if new user is added
 * send him a verification email.
 * 
 * OR
 * 
 * If user email is changed then update the email
 * and set verify to false and send verification email
 * 
 */
UserSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('email')) {
        let token = jwt.sign({ id: this._id }, config.emailConfirmationSecret, { expiresIn: '1h' });
        this.emailToken = token;
        this.verified = false;

        let verificationUrl = `${config.backendUrl}/auth/verify-email/${token}`;
        let data = mailer.verificationEmail({
            name: this.fullName || this.username,
            email: this.email,
            verificationUrl
        })
        console.log("TCL: data", data)
        await mailer.sendEmail(data);
    }

    return next();
});

UserSchema.methods = {
    validPassword: function (password) {
        var hash = crypto.pbkdf2Sync(password, this.passwordSalt, 10000, 512, 'sha512').toString('hex');
        return this.passwordHash === hash;
    },

    setPassword: function (password) {
        this.passwordSalt = crypto.randomBytes(16).toString('hex');
        this.passwordHash = crypto.pbkdf2Sync(password, this.passwordSalt, 10000, 512, 'sha512').toString('hex');
    },

    generateConfirmationUrl: function () {

    },

    generateResetPasswordUrl: function () {
        let token = jwt.sign({ id: this._id }, config.resetPasswordSecret, { expiresIn: '1h' });
        return `${config.backendUrl}/auth/resetPassword/${token}`;
    },

    generateJWT: function () {
        return jwt.sign({
            id: this._id,
            username: this.username
        }, config.jwtSecret, { expiresIn: '1y' });
    },

    toAuthJSON: function () {
        return {
            id: this._id,
            email: this.email,
            verified: this.verified,
            token: this.generateJWT()
        };
    },

    toJSON: function () {
        return {
            id: this._id,
            username: this.username,
            email: this.email,
            verified: this.verified,
            fullName: this.fullName,
            avatar: this.avatar

        };
    }
}

UserSchema.statics = {
    createNew: async function (data) {
        const { username, email, fullName, password } = data;
        let user = new this();
        user.username = username;
        user.email = email;
        user.fullName = fullName;
        user.setPassword(password);
        await user.save();
        return user;
    },
    findByIdentifier: async function (identifier) {
        return await this.findOne({ $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }] });
    },
    verifyEmail: async function (token) {
        const decodedToken = await jwt.verify(token, config.emailConfirmationSecret);
        let { id } = decodedToken;
        let nsgUser = await this.findOne({ _id: id, emailToken: token });
        if (nsgUser) {
            await this.findByIdAndUpdate(id, { $set: { verified: true } })
            let redirectUrl = `${config.frontendUrl}/server-login?success=true&token=${nsgUser.generateJWT()}`;
            return redirectUrl;
        } else {
            throw new Error('Invalid token. Try again later.')
        }
    }

    /**
 * List users in descending order of 'createdAt' timestamp.
 * @param {number} skip - Number of users to be skipped.
 * @param {number} limit - Limit number of users to be returned.
 * @returns {Promise<User[]>}
 */
    //   list({ skip = 0, limit = 50 } = {}) {
    //     return this.find()
    //       .sort({ createdAt: -1 })
    //       .skip(+skip)
    //       .limit(+limit)
    //       .exec();
    //   }
}

mongoose.model('User', UserSchema);
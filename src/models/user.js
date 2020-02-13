import mongoose from 'mongoose'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import config from '../config/config';
// import * as mailer from '../mailer'

let UserSchema = new mongoose.Schema({
    username: { type: String, lowercase: true, unique: true, trim: true, required: true },
    email: { type: String, lowercase: true, unique: true, trim: true, required: true },

    fullName: { type: String, },
    avatar: { type: String, default: '/uploads/avatarHolder.png' },

    dob: { type: String, default: 'YYYY-MM-DD'},
    gender: { type: String, enum: ['Male', 'Female', 'other'] },
    address: { type: String, default: 'x y z'},
    // country: { type: String, default: '' },
    // state: { type: String, default: '' },
    // city: { type: String, default: '' },

    passwordHash: { type: String, },
    passwordSalt: { type: String, },
    
    verified: { type: Boolean, default: false },
    since: { type: Date, default: Date.now },
    emailToken: { type: String, },
    token: { type: String },
    /** Relationships */
    // folders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Folder', autopopulate: true }],
    // files: [{type: mongoose.Schema.Types.ObjectId, ref: 'File', authopopulate: true }],

}, { timestamps: true, versionKey: false, collection: 'User', toObject: {virtuals: true}, toJSON: { virtuals: true } });

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
        let verificationUrl = `${config.backendUrl}/auth/verify-email/${token}`;
        
        // let data = mailer.verificationEmail({
        //     name: this.fullName || this.username,
        //     email: this.email,
        //     verificationUrl
        // })
        // mailer.sendEmail(data);
    }

    return next();
});

UserSchema.virtual('avatarUrl')
    .set(function(url) {
        avatar = url + this.avatar;
        this.set({ avatar });
    })
    .get(function() {
        return this.avatar;
    });


 /** Instance Methods of Schema */
UserSchema.methods = {
    validPassword: function (password) {
        var hash = crypto.pbkdf2Sync(password, this.passwordSalt, 10000, 512, 'sha512').toString('hex');
        return this.passwordHash === hash;
    },

    setPassword: function (password) {
        this.passwordSalt = crypto.randomBytes(16).toString('hex');
        this.passwordHash = crypto.pbkdf2Sync(password, this.passwordSalt, 10000, 512, 'sha512').toString('hex');
    },

    updateUserProfile: function(data) {
        const { fullname, username, email, dob, gender, address } = data;
        this.fullName = fullname;
        this.username = username;
        this.email = email;
        this.dob = dob;
        this.gender = gender;
        this.address = address;
        return this.toJSON();
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

    tokenDecode: function(token) {
        var decodedToken 
    },

    toAuthJSON: function () {
        return {
            id: this._id,
            email: this.email,
            verified: this.verified,
            token: this.generateJWT(),
        };
    },

    toJSON: function () {
        return {
            id: this._id,
            username: this.username,
            email: this.email,
            verified: this.verified,
            fullName: this.fullName,
            gender: this.gender,
            address: this.address,
            avatar: this.avatar,
            // folders: this.folders,
            // files: this.files,
            // avatarUrl: this.avatarUrl,

        };
    }
}

 /** Static Methods of Schema*/
UserSchema.statics = {
    createNew: async function (data) {
        const { username, email, fullName, password } = data;
        let user = new this();
        user.username = username;
        user.email = email;
        user.fullName = fullName;
        token: user.generateJWT(),
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
    },

    getUser: async function (id) {
        let User = await this.findOne({ _id: id });
        return User;
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

// UserSchema.plugin(require('mongoose-autopopulate'));
mongoose.model('User', UserSchema);
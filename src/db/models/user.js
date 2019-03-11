import mongoose from 'mongoose'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import moment from "moment";

let UserSchema = new mongoose.Schema({
    username: { type: String, lowercase: true, unique: true, required: true, index: true },
    email: { type: String, lowercase: true, unique: true, required: true, index: true },
    phonenumber: { type: String },

    role: { type: String, enum: ['user', 'admin'], default: 'user', lowercase: true, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'male', lowercase: true, required: true },
    dob: { type: String, default: "YYYY-DD-MM" },

    firstname: String,
    lastname: String,
    image: { type: String, default: 'https://res.cloudinary.com/maxifjaved/image/upload/v1552308757/avatarHolder_nqtkl1.jpg' },

    hash: String,
    salt: String,

    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },

    postNotification: { type: Boolean, default: true },
    peerNotification: { type: Boolean, default: true },
    privateMsgNotification: { type: Boolean, default: true },

    token: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserToken' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserPost' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Friend' }],
    referId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Refer' }],
    // friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPost' }

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
    return `${process.env.FRONTEND_URL}/auth/resetPassword/${token}`;
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
        id: this._id,
        username: this.username,
        email: this.email,
        emailVerified: this.emailVerified,
        phoneVerified: this.phoneVerified,
        fullname: this.fullname(),
        token: this.generateJWT(),
        image: this.image,
        gender: this.gender,
        dob: this.dob,
        postNotification: this.postNotification,
        peerNotification: this.peerNotification,
        privateMsgNotification: this.privateMsgNotification

    };
};
UserSchema.methods.toProfileJSONFor = function (user) {
    return {
        id: this._id,
        username: this.username,
        phonenumber: this.phonenumber,
        email: this.email,
        image: this.image,
        gender: this.gender,
        dob: this.dob
    };
};

UserSchema.methods.toJSON = function () {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        phonenumber: this.phonenumber,
        emailVerified: this.emailVerified,
        phoneVerified: this.phoneVerified,
        firstname: this.firstname,
        lastname: this.lastname,
        image: this.image,
        gender: this.gender,
        dob: this.dob,
        postNotification: this.postNotification,
        peerNotification: this.peerNotification,
        privateMsgNotification: this.privateMsgNotification

    };
};


UserSchema.methods.favorite = function (id) {
    if (this.favorites.indexOf(id) === -1) {
        this.favorites.push(id);
    }

    return this.save();
};

UserSchema.methods.unfavorite = function (id) {
    this.favorites.remove(id);
    return this.save();
};

UserSchema.methods.isFavorite = function (id) {
    return this.favorites.some(function (favoriteId) {
        return favoriteId.toString() === id.toString();
    });
};



UserSchema.methods.addFriend = function (id) {
    if (this.friends.indexOf(id) === -1) {
        this.friends.push(id);
    }
    return this.save();
};

UserSchema.methods.unFriend = function (id) {
    this.friends.remove(id);
    return this.save();
};

UserSchema.methods.isFriend = function (id) {
    return this.friends.some(function (friendId) {
        return friendId.toString() === id.toString();
    });
};


UserSchema.methods.friendshipRequest = function (id) {
    if (this.friendRequests.indexOf(id) === -1) {
        this.friendRequests.push(id);
    }
    return this.save();
};

UserSchema.methods.removeRequestFriendship = function (id) {
    this.friends.remove(id);
    return this.save();
};

UserSchema.methods.isFriendshipRequested = function (id) {
    return this.friendRequests.some(function (requestId) {
        return requestId.toString() === id.toString();
    });
};




mongoose.model('User', UserSchema);
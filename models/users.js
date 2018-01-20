var mongoose = require('mongoose')

var Schema = mongoose.Schema

var userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, lowercase: true, required: true },
    email: { type: String, lowercase: true, required: true },
    active: { type: Boolean, default: false },
    picture: { type: String },
    userType: { type: String, default: 'user' },
    gender: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', userSchema)

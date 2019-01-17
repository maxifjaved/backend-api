import mongoose from 'mongoose'
const User = mongoose.model('User');

export function getUserByIdentifier(identifier) {
    return User.findOne({ $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }] })
}

export function getUserById(id) {
    return User.findById(id)
}
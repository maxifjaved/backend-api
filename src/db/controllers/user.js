import mongoose from 'mongoose'
const User = mongoose.model('User');

import { sendConfirmationEmail } from '../../mailer'

export function getUserByIdentifier(identifier) {
    return User.findOne({ $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }] })
}

export async function createNewUser(data) {
    const { username, email, password } = data;
    let user = new User();
    user.username = username;
    user.email = email;
    user.setPassword(password);

    try {
        await sendConfirmationEmail(user);
        await user.save();

        return user;
    } catch (error) {
        throw new Error(error)
    }

}

export function getUserById(id) {
    return User.findById(id)
}
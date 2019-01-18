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

export async function updateUserById(id, data) {
    try {
        let user = await User.findById(id);
        let { firstname, lastname, image, password, isVerified } = data

        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.image = image || user.image;

        password ? user.setPassword(password) : null

        if (typeof isVerified !== 'undefined') {
            user.isVerified = isVerified;
        }

        await user.save()
        return user;

    } catch (error) {
        throw new Error(error)
    }
}


export function getUserById(id) {
    return User.findById(id)

}
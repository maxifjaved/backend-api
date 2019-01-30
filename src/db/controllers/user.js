import mongoose from 'mongoose'
import moment from 'moment'
const User = mongoose.model('User');

import { sendConfirmationEmail } from '../../mailer'

export function getUserByIdentifier(identifier) {
    return User.findOne({ $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }, { phonenumber: identifier }] })
}

export function isPhoneAssignedToOtherUser(phonenumber, id) {
    return User.findOne({ phonenumber: phonenumber, _id: { $ne: id } })
}


export async function createNewUser(data) {
    const { username, email, password, gender, dob } = data;
    let user = new User();
    user.username = username;
    user.email = email;
    user.gender = gender;
    user.dob = moment.utc(dob).format("YYYY-MM-DD")
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
        let { firstname, lastname, image, password, phonenumber, emailVerified, phoneVerified, gender, dob } = data

        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.image = image || user.image;

        user.gender = gender || user.gender;
        user.dob = moment.utc(dob).format("YYYY-MM-DD") || user.dob;

        user.phonenumber = phonenumber || user.phonenumber;

        password ? user.setPassword(password) : null

        if (typeof emailVerified !== 'undefined') {
            user.emailVerified = emailVerified;
        }

        if (typeof phoneVerified !== 'undefined') {
            user.phoneVerified = phoneVerified;
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

export function getAllUsers(data) {
    return User.find({})
}

export function deleteUserById(id) {
    return User.remove({ _id: id });
}
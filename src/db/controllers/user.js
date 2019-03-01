import mongoose from 'mongoose'
import moment from 'moment'
import fs from 'fs'
import path from 'path'
const User = mongoose.model('User');
const UserGroup = mongoose.model('Group');

import { sendConfirmationEmail } from '../../mailer';

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
    user.dob = dob
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
        let { firstname, lastname, image, password, phonenumber, emailVerified, phoneVerified, gender, dob, postNotification, peerNotification, privateMsgNotification } = data

        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        if (image) {
            let previousImagePath = path.join(__dirname, '/../../../public', user.image);
            if (fs.existsSync(previousImagePath)) { fs.unlinkSync(previousImagePath); };

            user.image = image;
        }

        user.gender = gender || user.gender;
        user.dob = dob || user.dob;


        if (phonenumber) {
            user.phoneVerified = false;
            user.phonenumber = phonenumber || user.phonenumber;
        }

        password ? user.setPassword(password) : null

        if (typeof emailVerified !== 'undefined') {
            user.emailVerified = emailVerified;
        }

        if (typeof phoneVerified !== 'undefined') {
            user.phoneVerified = phoneVerified;
        }
        if (typeof postNotification !== 'undefined') {
            user.postNotification = postNotification;
        }

        if (typeof peerNotification !== 'undefined') {
            user.peerNotification = peerNotification;
        }

        if (typeof privateMsgNotification !== 'undefined') {
            user.privateMsgNotification = privateMsgNotification;
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

export function getAllUsers(query, limit, offset) {
    return Promise.all([
        User.find(query)
            .limit(Number(limit))
            .skip(Number(offset))
            .sort({ createdAt: 'desc' })
            .exec(),

        User.count(query).exec()
    ])
}
export function isUserExists(query) {
    return User.count(query);
}

export function deleteUserById(id) {
    return User.remove({ _id: id });
}
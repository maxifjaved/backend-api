import mongoose from 'mongoose'
import moment from 'moment'
const User = mongoose.model('User');
const UserGroup = mongoose.model('userGroup');

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
    user.dob = dob
    user.setPassword(password);

    try {
        // await sendConfirmationEmail(user);


        await user.save();

        let userGroup = new UserGroup();
        userGroup.userId = user._id;
        userGroup.groupType = 'Public';
        await userGroup.save();

        let userGroup1 = new UserGroup();
        userGroup1.userId = user._id;
        userGroup1.groupType = 'Private';
        await userGroup1.save();

        let userGroup2 = new UserGroup();
        userGroup2.userId = user._id;
        userGroup2.groupType = 'Social';
        await userGroup2.save();

        user.groupId.push(userGroup._id) 
        user.groupId.push(userGroup1._id) 
        user.groupId.push(userGroup2._id) 

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
        user.image = image || user.image;

        user.gender = gender || user.gender;
        user.dob = dob || user.dob;

        user.phonenumber = phonenumber || user.phonenumber;

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

export function getAllUsers(data) {
    return User.find({})
}

export function deleteUserById(id) {
    return User.remove({ _id: id });
}
import mongoose from 'mongoose'
import isEmpty from 'lodash/isEmpty';
const UserToken = mongoose.model('UserToken');

import { getUserById } from './user'
import { sendPhoneVeficationCode } from '../../services/twilio'

export async function createUserToken(userId, type) {
    try {
        let user = await getUserById(userId)
        let { phonenumber } = user;
        let verificationCode = Math.random().toString(36).substring(2, 6);

        let userToken = new UserToken();
        userToken.token = verificationCode
        userToken.type = type
        userToken.user = user

        await sendPhoneVeficationCode(phonenumber, verificationCode);

        await userToken.save();
        user.token.push(userToken);
        await user.save();

        return user;
    } catch (error) {
        throw new Error(error)
    }
}

export async function updateUserToken(data) {
    const errors = {};
    const { code } = data;

    try {
        let userToken = await UserToken.findOne({ token: code });

        if (!userToken) {
            errors.form = 'Invalid user verification code.'; //throw new Error('Invalid user token')
        }

        if (!errors.code && userToken.isUsed) {
            errors.form = 'User token already used.';
        }

        let isValid = isEmpty(errors)

        if (!isValid) { return { errors, isValid }; }

        userToken.isUsed = true
        await userToken.save();
        return { userToken, isValid };
    } catch (error) {
        throw new Error(error)
    }
}
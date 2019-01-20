import mongoose from 'mongoose'
const UserToken = mongoose.model('UserToken');

import { getUserById } from './user'
import { sendPhoneVeficationCode } from '../../services/twilio'

export async function createUserToken(userId, type) {
    let user = await getUserById(userId)
    let { phonenumber } = user;
    let verificationCode = Math.random().toString(36).substring(2, 6);

    try {
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
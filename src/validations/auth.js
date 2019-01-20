import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

import { usernameIsValid } from '../helper'

import * as userController from '../db/controllers/user';

export async function signup(data) {
    const errors = {};

    if (!data.email || Validator.isEmpty(data.email)) {
        errors.email = 'This field is required';
    }

    if (!errors.email && !Validator.isEmail(data.email)) {
        errors.email = 'Invalid email address';
    }

    if (!data.username || Validator.isEmpty(data.username)) {
        errors.username = 'This field is required';
    }

    if (!errors.username && !usernameIsValid(data.username)) {
        errors.username = 'Only number, letter and _, ., - characters are allowed';
    }
    if (!errors.username && !Validator.isLength(data.username, { min: 5 })) {
        errors.username = 'Username must be of minimum 5 characters.';
    }

    if (!data.password || Validator.isEmpty(data.password)) {
        errors.password = 'This field is required';
    }

    if (!errors.password && !Validator.isLength(data.password, { min: 5 })) {
        errors.password = 'Password must be of minimum 5 characters.';
    }

    if (!data.confirmationPassword || Validator.isEmpty(data.confirmationPassword)) {
        errors.confirmationPassword = 'This field is required';
    }

    if (!errors.password && !errors.confirmationPassword && !Validator.equals(data.password, data.confirmationPassword)) {
        errors.confirmationPassword = 'Password not matched.';
    }



    try {
        let signupErrors = await signupDB(data, errors)

        return {
            errors: signupErrors,
            isValid: isEmpty(signupErrors),
        };
    } catch (error) {
        throw new Error(error)
    }


}

export async function signupDB(data, errors = {}) {

    try {
        if (!errors.email) {
            let user = await userController.getUserByIdentifier(data.email)

            if (user) {
                if (user.username === data.username.toLowerCase()) {
                    errors.username = 'There is user with such username';
                }
                if (user.email === data.email.toLowerCase()) {
                    errors.email = 'There is user with such email';
                }
            }
        }

        if (!errors.username) {
            let user = await userController.getUserByIdentifier(data.username)

            if (user) {
                if (user.username === data.username.toLowerCase()) {
                    errors.username = 'There is user with such username';
                }
                if (user.email === data.email.toLowerCase()) {
                    errors.email = 'There is user with such email';
                }
            }
        }
        return errors
    } catch (error) {
        throw new Error(error)
    }
}

export function phoneVerification(data) {
    const errors = {};

    if (!data.phonenumber || Validator.isEmpty(data.phonenumber)) {
        errors.phonenumber = 'This field is required';
    }

    if (!errors.phonenumber && !Validator.isMobilePhone(data.phonenumber, 'any', { strictMode: true })) {
        errors.phonenumber = 'Invalid Phone Number';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

}

export async function phoneVerificationDB(data) {
    const errors = {};

    try {
        let user = await userController.getUserByIdentifier(data.phonenumber)

        if (user) {
            if (user.phonenumber === data.phonenumber) {
                errors.phonenumber = 'There is user with such phonenumber';
            }
        }

        return {
            errors,
            isValid: isEmpty(errors),
        };

    } catch (error) {
        throw new Error(error)
    }
}




export function login(data) {
    const errors = {};

    if (!data.identifier || Validator.isEmpty(data.identifier)) {
        errors.identifier = 'Identifier is required';
    }

    if (!data.password || Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };

}

export function resetPassword(data) {
    const errors = {};

    if (!data.password || Validator.isEmpty(data.password)) {
        errors.password = 'This field is required';
    }

    if (!errors.password && !Validator.isLength(data.password, { min: 5 })) {
        errors.password = 'Password must be of minimum 5 characters.';
    }

    if (!data.confirmationPassword || Validator.isEmpty(data.confirmationPassword)) {
        errors.confirmationPassword = 'This field is required';
    }

    if (!errors.password && !errors.confirmationPassword && !Validator.equals(data.password, data.confirmationPassword)) {
        errors.confirmationPassword = 'Password not matched.';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };

}
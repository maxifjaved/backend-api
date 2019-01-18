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




    let signupErrors = await signupDB(data, errors)

    return {
        errors: signupErrors,
        isValid: isEmpty(signupErrors),
    };

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
        error = { ...errors, ...error };
        return error;
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
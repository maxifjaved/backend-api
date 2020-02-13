import mongoose from 'mongoose';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
const User = mongoose.model('User');

export async function signup(data) {
    const errors = {};

    try {
        if (!data.username || validator.isEmpty(data.username)) {
            errors.username = 'This field is required';
        }

        if (!errors.username && !validator.isAlphanumeric(data.username)) {
            errors.username = 'Username should be alphanumeric';
        }

        if (!errors.username && !validator.isLength(data.username, { min: 3 })) {
            errors.username = 'Username must be of minimum 3 characters.';
        }

        if (!data.email || validator.isEmpty(data.email)) {
            errors.email = 'This field is required';
        }

        if (!errors.email && !validator.isEmail(data.email)) {
            errors.email = 'Invalid email address';
        }

        if (!errors.username) {
            let nsgUser = await User.findByIdentifier(data.username);
            if (nsgUser) {
                if (!errors.username && nsgUser.username === (data.username).toLowerCase()) {
                    errors.username = 'There is user with such username';
                }
            }
        }

        if (!errors.email) {
            let nsgUser = await User.findByIdentifier(data.email);
            if (nsgUser) {
                if (!errors.email && nsgUser.email === (data.email).toLowerCase()) {
                    errors.email = 'There is user with such email';
                }
            }
        }


        if (!data.fullName || validator.isEmpty(data.fullName)) {
            errors.fullName = 'This field is required';
        }

        if (!data.password || validator.isEmpty(data.password)) {
            errors.password = 'This field is required';
        }

        if (!errors.password && !validator.isLength(data.password, { min: 5 })) {
            errors.password = 'Password must be of minimum 5 characters.';
        }

        if (!data.confirmationPassword || validator.isEmpty(data.confirmationPassword)) {
            errors.confirmationPassword = 'This field is required';
        }

        if (!errors.password && !errors.confirmationPassword && !validator.equals(data.password, data.confirmationPassword)) {
            errors.confirmationPassword = 'Password not matched.';
        }


        return {
            errors,
            isValid: isEmpty(errors),
        };
    } catch (error) {
        throw new Error(error)
    }
}

export async function login(data) {
    const errors = {};

    try {
        if (!data.identifier || validator.isEmpty(data.identifier)) {
            errors.identifier = 'This field is required';
        }


        if (!data.password || validator.isEmpty(data.password)) {
            errors.password = 'This field is required';
        }

        return {
            errors,
            isValid: isEmpty(errors),
        };
    } catch (error) {
        throw new Error(error)
    }
}

export function resetPassword(data) {
    const errors = {};
    const { password, confirmPassword } = data;

    if (!password || Validator.isEmpty(password)) {
        errors.password = 'Password field is required';
    }
        if (!errors.password && !Validator.isLength(password, { min: 5 })) {
            errors.password = 'Password must be of minimum 5 characters.';
        }
        if (!confirmPassword || Validator.isEmpty(confirmPassword)) {
            errors.confirmPassword = 'Confirm Password field is required';
        }
    if (!errors.password && !errors.confirmPassword && !Validator.equals(password, confirmPassword)) {
        errors.confirmPassword = 'Password not matched.';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
}
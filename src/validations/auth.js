import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';


export function signup(data) {
    const errors = {};

    if (!data.email || Validator.isEmpty(data.email)) {
        errors.email = 'This field is required';
    }

    if (!data.username || Validator.isEmpty(data.username)) {
        errors.username = 'This field is required';
    }

    if (!data.password || Validator.isEmpty(data.password)) {
        errors.password = 'This field is required';
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
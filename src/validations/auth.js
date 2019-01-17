import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';


export function signup(data) {
    const errors = {};

    if (Validator.isNull(data.email)) {
        errors.email = 'This field is required';
    }

    if (Validator.isNull(data.username)) {
        errors.username = 'This field is required';
    }

    if (Validator.isNull(data.password)) {
        errors.password = 'This field is required';
    }
    if (Validator.isNull(data.confirmationPassword)) {
        errors.confirmationPassword = 'This field is required';
    }

    if (!errors.password && !Validator.equals(data.password, data.confirmationPassword)) {
        errors.confirmationPassword = 'Password not matched.';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };

}
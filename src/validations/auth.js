import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';


export function signup(data) {
    const errors = {};

    if (Validator.isNull(data.email)) {
        errors.email = 'This field is required';
    }

    if (Validator.isNull(data.password)) {
        errors.password = 'This field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };

}
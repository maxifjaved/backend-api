import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';



export function createRefer(data) {
    const errors = {};

    if (!data.contact || Validator.isEmpty(data.contact)) {
        errors.contact = 'This field is required';
    }

    if (!data.name || Validator.isEmpty(data.name)) {
        errors.name = 'This field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };

}


export function checkContact(data) {
    const errors = {};

    if (!data.length > 0 || Validator.isEmpty(data)) {
        errors = 'Phone number list empty';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };

}


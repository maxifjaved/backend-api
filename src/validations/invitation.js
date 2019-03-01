import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';



export function validateInvitation(data) {
    const errors = {};

    if (!data.phonenumber || Validator.isEmpty(data.phonenumber)) {
        errors.phonenumber = 'This field is required';
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


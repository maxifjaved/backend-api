import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export async function signup(data) {
    const errors = {};

    return {
        errors,
        isValid: isEmpty(errors),
    };

}
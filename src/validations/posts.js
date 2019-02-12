import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export function newPost(data) {
    const errors = {};

    if (!data.title || Validator.isEmpty(data.title)) {
        errors.title = 'This field is required';
    }

    if (!data.place || Validator.isEmpty(data.place)) {
        errors.place = 'This field is required';
    }

    if (!data.description || Validator.isEmpty(data.description)) {
        errors.description = 'This field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };

}
import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export function newGroup(data) {
    const errors = {};

    if (!data.groupTitle || Validator.isEmpty(data.groupTitle)) {
        errors.groupTitle = 'This field is required';
    }
    if (!data.groupId || Validator.isEmpty(data.groupId)) {
        errors.groupId = 'This field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };

}

export function groupIdValidation(data) {
    const errors = {};

    if (!data.groupId || Validator.isEmpty(data.groupId)) {
        errors.groupId = 'This field is required';
    }
    

    return {
        errors,
        isValid: isEmpty(errors),
    };

}
import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';



export function validateFriend(data) {
    const errors = {};

    if (!data.groupId || Validator.isEmpty(data.groupId)) {
        errors.groupId = 'This field is required';
    }
    if (!data.userId || Validator.isEmpty(data.userId)) {
        errors.userId = 'This field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
}

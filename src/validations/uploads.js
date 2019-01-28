import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

const fileTypes = {
    'image': ['image/jpeg', 'image/png']
}

export function checkFileType(file, type) {
    const errors = {};

    const { mimetype } = file

    if (fileTypes[type].indexOf(mimetype) === -1) {
        errors[type] = `Only ${fileTypes[type].join(', ')} mimetype are allowed.`
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };

}
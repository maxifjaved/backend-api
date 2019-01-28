import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

const fileTypes = {
    'image': ['image/jpeg', "image/jpg", 'image/png'],
    'video': ["video/wav", "video/mp4"]
}

export function checkFileType(file, type) {
    const errors = {};

    const { mimetype } = file

    if (fileTypes[type].indexOf(mimetype) === -1) {
        errors[type] = `Only ${fileTypes[type].join(', ')} mimetypes are allowed.`
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };

}

export function isImageOrVideo(file) {
    const errors = {};

    const { mimetype } = file

    if (fileTypes['image'].indexOf(mimetype) === -1 && fileTypes['video'].indexOf(mimetype) === -1) {
        errors.attachment = `Only ${fileTypes['image'].join(', ')}, ${fileTypes['video'].join(', ')} mimetypes are allowed.`
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
} 
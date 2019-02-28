import isEmpty from 'lodash/isEmpty';


export function validateContactList(data) {
    const errors = {};

    if (!data.contacts && !data.contacts.length) {
        errors.contacts = `Invalid contacts details.`;
    }

    if (!errors.contacts) {
        for (let index = 0; index < data.contacts.length; index++) {
            const element = data.contacts[index];
            if (!element.phonenumber) {
                errors.contacts = `Invalid Phonenumber for ${element.name}`;
                break;
            }
        }
    }
    return {
        errors,
        isValid: isEmpty(errors),
    };



}
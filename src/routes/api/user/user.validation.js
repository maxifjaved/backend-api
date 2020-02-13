import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

const dateRegx = /[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])/;

export function validatePasswordUpdate(data) {
    const errors = {};
    const { oldPassword, newPassword } = data;

    if(!oldPassword || Validator.isEmpty(oldPassword)) {
        errors.field = "Password field is required";
    }
        if(!errors.oldPassword && !Validator.isLength(oldPassword, { min: 5 })) {
            errors.field = "oldPassword must be of minimum 5 characters.";
        }
            if(!newPassword || Validator.isEmpty(newPassword)) {
                errors.field = "newPassword field is required";

            }
    return {
        errors,
        isValid: isEmpty(errors),
    };
}

export function validateUpdateProfile(data) {
    const errors = {};
    const { fullname, dob, gender, email, username } = data;

    if(!username || Validator.isEmpty(username)) {
        errors.username = 'username is required';
    }
        if(!fullname || Validator.isEmpty(fullname)) {
            errors.fullname = 'Fullname is required';
        }
            if (gender && ['Male', 'Female', 'other'].indexOf(gender) == -1) {
                errors.gender = 'Gender value must be: Male, Female or other';
            }
                // if (dob && !dateRegx.test(dob)) {
                //     errors.dob = 'Must be a valid date as YYYY-MM-DD';
                // }

            // if(!email || !Validator.isEmpty(email)) {
            //     errors.email = 'Email is required';

            // }

        // if (!errors.email && !Validator.isEmail(email)) {
        //     errors.email = 'Invalid email address';
        // }

    return {
        errors,
        isValid: isEmpty(errors),
    };
}
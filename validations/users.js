var isEmpty = require('../helpers/isEmpty')
var isEmail = require('../helpers/isEmail')

function createUserProfile(data) {
    var errors = {}

    if (!data.firstName) {
        errors.firstName = 'First Name field is required'
    }
    if (!data.lastName) {
        errors.lastName = 'Last Name field is required'
    }
    if (!data.username) {
        errors.username = 'Username field is required'
    }
    if (!data.email) {
        errors.email = 'Email field is required'
    }
    if (!errors.email && !isEmail(data.email)) {
        errors.email = 'Email is invalid'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = { createUserProfile }
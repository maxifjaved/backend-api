var isEmpty = require('../helpers/isEmpty')

function uploadNewPicture(data) {
    var errors = {}

    if (!data.title) {
        errors.title = 'Title field is required'
    }
    if (!data.description) {
        errors.description = 'Description is required field'
    }
    if (!data.url) {
        errors.url = 'Picture Url is required'
    }
    if (!data.owner) {
        errors.owner = 'User ID is required'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = { uploadNewPicture }
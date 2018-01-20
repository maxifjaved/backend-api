var mongoose = require('mongoose')

var userValidation = require('../validations').users
var User = mongoose.model('User')

function createUserProfile(req, res, next) {
    var validations = userValidation.createUserProfile(req.body)
    var errors = validations.errors, isValid = validations.isValid
    var firstName = req.body.firstName,
        lastName = req.body.lastName,
        username = req.body.username,
        email = req.body.email,
        gender = req.body.gender,
        state = req.body.state,
        zip = req.body.zip,
        country = req.body.country


    if (!isValid) return res.status(403).json({ errors })


    User.findOne({ $or: [{ email: email }, { username: username }] }, (err, user) => {
        if (err) return res.status(500).json({ errors: err })

        if (user) {
            if (user.username === username) {
                errors.username = 'User with such username already exists'
            }
            if (user.email === email) {
                errors.email = 'User with such email already exists'
            }

            return res.status(403).json({ errors })
        }

        let newUser = new User({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            gender: gender,
            state: state,
            zip: zip,
            country: country
        })

        newUser.save((err, savedUser) => {
            if (err) return res.status(500).json({ errors: err })


            return res.status(200).json({ user: savedUser })
        })
    })
}

function getUserProfile(req, res, next) {
    const { id } = req.params

    User.findById(id, (err, user) => {
        if (err) return res.status(500).json({ errors: err })

        if (!user) return res.status(404).json({ message: 'User not found.' })

        return res.status(200).json({ user })
    })
}

function updateUserProfile(req, res, next) {
    const { id } = req.params

    User.findById(id, (err, user) => {
        if (err) return res.status(500).json({ errors: err })

        if (!user) return res.status(404).json({ message: 'User not found to update.' })

        const { firstName, lastName, gender, state, zip, country } = req.body

        user.firstName = firstName || user.firstName
        user.lastName = lastName || user.lastName
        user.gender = gender || user.gender
        user.state = state || user.state
        user.zip = zip || user.zip
        user.country = country || user.country
        user.updatedAt = new Date()

        user.save((err, savedUser) => {
            if (err) return res.status(500).json({ errors: err })

            return res.status(200).json({ message: 'User successfully Updated', user: savedUser })
        })
    })
}

function deleteUserProfile(req, res, next) {
    const { id } = req.params

    User.findOneAndRemove({ _id: id }, (err, user) => {
        if (err) return res.status(500).json({ errors: err })

        return res.status(200).json({ sucess: 'User successfully deleted', user })
    })
}

function getAllUsers(req, res, next) {
    User.find({}).exec((err, users) => {
        if (err) return res.status(500).json({ errors: err })

        return res.status(200).json({ users })
    })
}

module.exports = { createUserProfile, getUserProfile, updateUserProfile, deleteUserProfile, getAllUsers }

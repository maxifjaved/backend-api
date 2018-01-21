const mongoose = require('mongoose')

const picturesValidation = require('../validations').pictures
const User = mongoose.model('User')
const Picture = mongoose.model('Picture')

function uploadNewPicture(req, res, next) {
    let { errors, isValid } = picturesValidation.uploadNewPicture(req.body)
    if (!isValid) return res.status(403).json({ errors })

    const { title, description, url, owner, rights } = req.body

    User.findById(owner, (err, user) => {
        if (err) return res.status(500).json({ errors: err })

        let picture = new Picture({ title, description, url, owner, rights })
        picture.save((err) => {
            if (err) return res.status(500).json({ errors: err })

            user.picture = [...user.picture, picture]
            user.save((err) => {
                if (err) return res.status(500).json({ errors: err })

                return res.status(200).json({ picture })
            })
        })
    })
}

function getPictureById(req, res, next) {
    const { id } = req.params

    Picture.findById(id, (err, picture) => {
        if (err) return res.status(500).json({ errors: err })

        return res.status(200).json({ picture })
    })
}

function updatePicture(req, res, next) {
    const { id } = req.params

    Picture.findById(id, (err, picture) => {
        if (err) return res.status(500).json({ errors: err })

        const { title, description, url, rights } = req.body
        picture.title = title || picture.title
        picture.description = description || picture.description
        picture.url = url || picture.url
        picture.rights = rights || picture.rights

        picture.save((err, newPicture) => {
            if (err) return res.status(500).json({ errors: err })

            return res.status(200).json({ picture: newPicture })
        })

    })
}
function deletePicture(req, res, next) {
    const { id } = req.params

    Picture.findOneAndRemove({ _id: id }, (err, picture) => {
        if (err) return res.status(500).json({ errors: err })

        if (!picture) return res.status(404).json({ errors: 'Picture with such id not found.' })

        User.findById(picture.owner, (err, user) => {
            if (err) return res.status(500).json({ errors: err })
            user.picture.remove(picture._id)

            user.save((err, updatedUser) => {
                if (err) return res.status(500).json({ errors: err })

                return res.status(200).json({ sucess: 'Picture successfully deleted.', picture })
            })
        })

    })
}

function getPictureByUserId(req, res, next) {
    const { userId } = req.params

    User.findOne({ _id: userId }).populate('picture').exec((err, pictures) => {
        if (err) return res.status(500).json({ errors: err })

        return res.status(200).json({ pictures })
    });
}

function getAllPictures(req, res, next) {
    Picture.find({}).exec((err, pictures) => {
        if (err) return res.status(500).json({ errors: err })

        return res.status(200).json({ pictures })
    })
}

module.exports = { getAllPictures, uploadNewPicture, getPictureByUserId, deletePicture, updatePicture, getPictureById }

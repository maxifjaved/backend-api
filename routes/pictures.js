const express = require('express')
const router = express.Router()
const pictures = require('../controllers').pictures

router.route('/')
    .get(pictures.getAllPictures)

router.route('/new')
    .post(pictures.uploadNewPicture)

router.route('/:userId/pictures')
    .get(pictures.getPictureByUserId)

router.route('/:id')
    .get(pictures.getPictureById)
    .patch(pictures.updatePicture)
    .delete(pictures.deletePicture)

module.exports = router
const express = require('express')
const router = express.Router()

const users = require('../controllers').users

router.route('/')
  .get(users.getAllUsers)

router.route('/new')
  .post(users.createUserProfile)

router.route('/:id')
  .get(users.getUserProfile)
  .patch(users.updateUserProfile)
  .delete(users.deleteUserProfile)

module.exports = router

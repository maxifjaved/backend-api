const express = require('express')
const router = express.Router()

const users = require('./users')
const pictures = require('./pictures')

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'))

router.use('/users', users)
router.use('/pictures', pictures)

module.exports = router

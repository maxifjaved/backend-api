var express = require('express')
var router = express.Router()

var users = require('./users')
/** GET /health-check - Check service health */
router.get('/health-check', function (req, res) { res.send('OK') })

router.use('/users', users)

module.exports = router

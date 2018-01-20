var mongoose = require('mongoose')
mongoose.Promise = global.Promise

var MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost/backend-api-chris'

function mongodbConnection() {
    mongoose.connect(MONGODB_URL, { keepAlive: true, reconnectTries: 30 })

    mongoose.connection.on('connected', function () {
        console.log(`Mongoose default connection open to ${MONGODB_URL}`)
    })

    mongoose.connection.on('error', () => {
        throw new Error(`unable to connect to database: ${MONGODB_URL}`)
    })

    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection disconnected')
    })

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination')
            process.exit(0)
        })
    })
}

module.exports = mongodbConnection()

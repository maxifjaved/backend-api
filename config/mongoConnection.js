
var mongoose = require('mongoose')

function mongodbConnection() {
    mongoose.connect(process.env.MONGODB_URL, { keepAlive: true, reconnectTries: 30, useMongoClient: true })

    mongoose.connection.on('connected', function () {
        console.log(`Mongoose default connection open to ${process.env.MONGODB_URL}`)
    })

    mongoose.connection.on('error', () => {
        throw new Error(`unable to connect to database: ${process.env.MONGODB_URL}`)
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

module.exports = mongodbConnection
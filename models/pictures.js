const mongoose = require('mongoose')
const User = mongoose.model('User')
const Schema = mongoose.Schema

const PictureSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    rights: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})


module.exports = mongoose.model('Picture', PictureSchema)
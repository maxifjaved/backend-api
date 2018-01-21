var mongoose = require('mongoose')
const User = mongoose.model('User')

var Schema = mongoose.Schema

var PictureSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    rights: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

// PictureSchema.pre('remove', function (next) {
//     var picture = this
//     console.log('5a64430d8ce6242c94069c1b')
//     User.update(
//         { picture: picture._id },
//         { $pull: { picture: picture._id } },
//         { multi: true },
//         next)
// })


module.exports = mongoose.model('Picture', PictureSchema)
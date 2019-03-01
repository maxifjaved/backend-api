import mongoose from 'mongoose'

let InvitationSchema = new mongoose.Schema({
    phonenumber: { type: String, required: true },
    name: { type: String },
    status: { type: String, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


InvitationSchema.methods.toJSON = function () {
    return {
        id: this._id,
        name: this.name,
        phonenumber: this.phonenumber,
        user: this.user
    }
}

mongoose.model('Invitation', InvitationSchema);
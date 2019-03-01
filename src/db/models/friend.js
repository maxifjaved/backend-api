import mongoose from 'mongoose'

let FriendSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    friend: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    status: { type: String, enum: ['invite', 'request', 'friend', 'block'], lowercase: true, required: true },
}, { timestamps: true });

FriendSchema.methods.toJSON = function () {
    return {
        id: this._id,
        user: this.user,
        friend: this.friend,
        group: this.group,
        status: this.status
    };
};


mongoose.model('Friend', FriendSchema);
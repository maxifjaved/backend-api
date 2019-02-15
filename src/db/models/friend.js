import mongoose from 'mongoose'

let FriendSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    friend: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    status: { type: String, enum: ['invited', 'requested', 'friend', 'blocked'], default: 'requested', lowercase: true, required: true },
}, { timestamps: true });


mongoose.model('Friend', FriendSchema);
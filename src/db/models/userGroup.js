import mongoose from 'mongoose'

let userGroupSchema = new mongoose.Schema({
    groupTitle: { type: String },
    // groupType: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    groupMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

}, { timestamps: true });

mongoose.model('userGroup', userGroupSchema);
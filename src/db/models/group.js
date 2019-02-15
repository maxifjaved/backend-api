import mongoose from 'mongoose'

let userGroupSchema = new mongoose.Schema({
    title: { type: String },
}, { timestamps: true });

mongoose.model('Group', userGroupSchema);
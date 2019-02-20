import mongoose from 'mongoose'

let ReferSchema = new mongoose.Schema({
    contact: { type: String, required: true },
    name: { type: String, required: true },
    code: { type: String },
    status: { type: String, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

mongoose.model('Refer', ReferSchema);
import mongoose from 'mongoose'

let UserTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, index: true },
    type: { type: String, enum: ['email-confirmation', 'phone-confirmation', 'phone-reset-password', 'email-reset-password', 'auth-token',], lowercase: true, required: true },
    isUsed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

UserTokenSchema.methods.toJSON = function () {
    return {
        id: this._id,
        token: this.token,
        type: this.type
    };
};


mongoose.model('UserToken', UserTokenSchema);
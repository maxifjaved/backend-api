import mongoose from 'mongoose'

let userGroupSchema = new mongoose.Schema({
    title: { type: String },
}, { timestamps: true });


userGroupSchema.methods.toJSON = function () {
    return {
        id: this._id,
        title: this.title,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

mongoose.model('Group', userGroupSchema);
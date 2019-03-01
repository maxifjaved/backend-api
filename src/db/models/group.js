import mongoose from 'mongoose'

let userGroupSchema = new mongoose.Schema({
    title: { type: String },
}, { timestamps: true });


userGroupSchema.methods.toJSON = function () {
    return {
        id: this._id,
        title: this.title
    };
};

mongoose.model('Group', userGroupSchema);
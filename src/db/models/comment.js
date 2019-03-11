import mongoose from 'mongoose'

var CommentSchema = new mongoose.Schema({
    body: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPost' }
}, { timestamps: true });

// Requires population of author
CommentSchema.methods.toJSONFor = function (user) {
    return {
        id: this._id,
        body: this.body,
        createdAt: this.createdAt,
        user: user ? this.user.toProfileJSONFor(user) : null
    };
};

mongoose.model('Comment', CommentSchema);
import mongoose from 'mongoose'

//video/photo data, //list of userIds to share with
let UserPostSchema = new mongoose.Schema({
    title: String,
    place: String,
    description: String,
    attachment: String,
    favoritesCount: { type: Number, default: 0 },
    // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tagList: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

UserPostSchema.methods.updateFavoriteCount = function () {
    var userPost = this;

    return User.count({ favorites: { $in: [userPost._id] } }).then(function (count) {
        userPost.favoritesCount = count;

        return userPost.save();
    });
};

UserPostSchema.methods.toJSONFor = function (user) {
    return {
        title: this.title,
        description: this.description,
        place: this.place,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        tagList: this.tagList,
        favorited: user ? user.isFavorite(this._id) : false,
        favoritesCount: this.favoritesCount,
        user: user ? this.user.toProfileJSONFor(user) : null
    };
};


mongoose.model('UserPost', UserPostSchema);
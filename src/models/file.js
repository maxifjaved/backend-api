import mongoose from 'mongoose';
// import config from '../config';

var FileSchema = new mongoose.Schema({

    title: { type: String, required: [true, "title can't be blank"], index: true },
    name: { type: String, required: [true, "Name can't be blank"], index: true },
    path: { type: String, required: [true, "path can't be blank"], index: true },
    type: { type: String, required: [true, "mimetype can't be blank"], index: true },
    size: { type: Number, required: [true, "Size can't be blank"], index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}

}, { timestamps: true, versionKey: false, collection: 'File', toObject: { virtuals: true}, toJSON: { virtuals: true } });

// FileSchema.virtual('fileUrl')
//         .set(function() {
//             // path = config + this.path;
//             // this.set({ path });
//         })
//         .get(function(){
//             return this.path;
//         })

FileSchema.methods = {
    toJSON: function () {
        return {
            id: this._id,
            title: this.title,
            name: this.name,
            path: this.path,
            type: this.type,
            size: this.size,
            userId: this.userId,
            // pathUrl: this.fileUrl,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

FileSchema.statics = {
    create: async function(data) {
        let file = new this();

        file.title = data.title;
        file.name = data.name;
        file.path = data.path;
        file.type = data.type;
        file.size = data.size;
        data.id ? file.userId = data.id : '';
        await file.save();

        return file;
    },

    rename: async function(data) {
        let file = await this.findById({ _id: data.fileId });

        file.title = data.title;
        await file.save();
        return file;
    },

    remove: async function(id) {
        let file = await this.findByIdAndRemove({ _id: id });
        return file;
    },

    list: async function(query, limit, offset) {
        return Promise.all([
            this.find(query)
            .limit(Number(limit))
            .skip(Number(offset))
            .exec(),
    
            this.estimatedDocumentCount(query).exec()
        ])
    },
}

mongoose.model('File', FileSchema);
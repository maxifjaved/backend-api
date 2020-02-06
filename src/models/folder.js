import mongoose from 'mongoose';

var FolderSchema = new mongoose.Schema({

    title: { type: String ,index: true, required: true, unique: true },
    // parentId: [{type: mongoose.Schema.Types.ObjectId, ref: 'Folder', autopopulate: true }],
    userId: { type: mongoose.Schema.Types.ObjectId },
    // files: [{type: mongoose.Schema.Types.ObjectId, ref: 'File', autopopulate: true }]
    files: [{
        title: { type: String, required: [true, "title can't be blank"], index: true },
        name: { type: String, required: [true, "Name can't be blank"], index: true },
        path: { type: String, required: [true, "path can't be blank"], index: true },
        type: { type: String, required: [true, "mimetype can't be blank"], index: true },
        size: { type: Number, required: [true, "Size can't be blank"], index: true },
    }]

}, { timestamps: true, versionKey: false, collection: 'Folder' });


FolderSchema.pre('findOneAndRemove', function(){
    console.log('from hook : ',this.files);
})

FolderSchema.methods = {
    toJSON: function () {
        return {
            id: this._id,
            title: this.title,
            // folders: this.parentId,
            userId: this.userId,
            files: this.files,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

FolderSchema.statics = {
    create: async function(data) {
        let folder = new this();
        folder.title = data.title;
        folder.userId = data.id;
        await folder.save();

        return folder;
    },

    rename: async function(data) {
        let folder = await this.findById({ _id: data.folderId });

        folder.title = data.title;
        await folder.save();
        return folder;
    },

    createSubfolder: async function(data) {
        let folder = new this();
        let parentFolder = await this.findById({ _id: data.folderId });
        folder.title = data.title;
        await folder.save();
        parentFolder._Ids.push(folder.id);
        await parentFolder.save();

        return folder;
    },

    insertFile: async function (detail, id) {
       let folder = await this.updateOne ({ _id: id }, { $push: { files: detail }});
//  also can use create method of subdocument array
//  parent.arrayName.create()
       return folder;
    },

    getFolderDetails: async function(id) {
        let folder = await this.findById({_id: id});
        return folder;
    },

    removeAFolderFile: async function(ids) {
        let folder = await this.findById({ _id: ids.folderId });
        folder.files.pull({ _id: ids.fileId });
//  also can use remove method of subdocument array
//  parent.arrayName.id().remove()
        await folder.save();
        return folder;
    },

    removeFolder: async function(id) {
        // let folder = await this.findOneAndRemove({_id: id} ).populate({path: 'files'});
        let folder = await this.findOneAndRemove({_id: id} );
        return folder;
    },

    list: async function(query, limit, offset) {
        return Promise.all([
            this
            .aggregate([
                { $match: {
                    userId: query
                }},
                { $unwind: "$files" },
                { $project: {
                    userId: '$userId',
                    title: '$title',
                    files: {
                        title: '$files.title',
                        name: '$files.name',
                        type: '$files.type',
                        size: '$files.size',
                        _id: '$files._id'
                    }
                }},
                { $sort: {size: 1}}
            ])
            // .populate({path: 'files', options: { sort: { 'size': 1}} })
            .limit(Number(limit))
            .skip(Number(offset))
            .exec(),
    
            this.estimatedDocumentCount(query).exec()
        ])
    }
}

// FolderSchema.plugin(require('mongoose-autopopulate'));
mongoose.model('Folder', FolderSchema);
import mongoose from 'mongoose';

var FolderSchema = new mongoose.Schema({

    title: { type: String ,index: true, required: true, unique: true },
    parentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Folder', autopopulate: true },
    userId: { type: mongoose.Schema.Types.ObjectId },
    files: [{type: mongoose.Schema.Types.ObjectId, ref: 'File', autopopulate: true }]

}, { timestamps: true, versionKey: false, collection: 'Folder' });


FolderSchema.pre('findOneAndRemove', function(){
    console.log('from hook : ',this.files);
});

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
},

/**
 * Query methods for Folder Schema
 */
FolderSchema.query = {
    byID: function(id) {
        return this.where({_id: id}).lean();
    },

    byParentID: function(parentId) {
        return this.where({ parentId: id }).lean();
    },

    byUserID: function(userId) {
        return this.where({ userId: userId }).lean();
    },

    byTitle: function(title) {
        return this.where({ title: title }).lean();
    },

    getAll: function() {
        return this.where({}).lean();
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

    createChildFolder: async function(data) {
        let folder = new this();
        let parentFolder = await this.findById({ _id: data.folderId });
        folder.title = data.title;
        await folder.save();
        parentFolder.parentId = folder.id;
        await parentFolder.save();

        return folder;
    },

//     insertFile: async function (detail, id) {
//        let folder = await this.updateOne ({ _id: id }, { $push: { files: detail }});
// //  also can use create method of subdocument array
// //  parent.arrayName.create()
//        return folder;
//     },

    insertFileLinkInFolder: async function(id, fileId) {
        let folder = await this.findById({_id: id});
        folder.files.push(fileId);
        await folder.save();
        return folder;
    },

    removeAFolderFile: async function(ids) {
        let folder = await this.findById({ _id: ids.folderId });
        // folder.files.pull({ _id: ids.fileId });
//  also can use remove method of subdocument array
//  parent.arrayName.id().remove()
        await folder.save();
        return folder;
    },

    removeFolder: async function(id) {
        let folder = await this.findOneAndRemove({_id: id} );
        return folder;
    },

    list: async function(query, limit, offset) {
        return Promise.all([
            this.find(query)            
            // .populate({path: 'files', options: { sort: { 'size': 1}} })
            .limit(Number(limit))
            .skip(Number(offset))
            .exec(),

            this.estimatedDocumentCount(query).exec()
        ])
    }
}

FolderSchema.plugin(require('mongoose-autopopulate'));
mongoose.model('Folder', FolderSchema);
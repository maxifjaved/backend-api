import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
// import * as validation from './gallery.validation';

const File = mongoose.model('File');
const Folder = mongoose.model('Folder');
const User = mongoose.model('User');

    /** File Section */
export async function createFile(req, res, next) {
    const { id } = req.currentUser;

    try {
        let files = req.files;
        let filecreate;
            for (const file of files) {

                const { originalname, path, filename, mimetype, size, fieldname } = file;
                let detail = {
                    title: originalname,
                    name: filename,
                    path: `/uploads/${file.filename}`,
                    type: mimetype,
                    size,
                    id
                };
                filecreate = await File.create(detail);
                
                // folder.fileId.push(fileAttach.id);
            }
            return res.status(200).json({ payload: filecreate.toJSON(), message: 'File Create Successfully.' });

    } catch (e) {

        return res.status(500).json({ errors: { message: e.toString() } });
    }
}

export async function renameFile(req, res, next) {
    let fileId = req.params.id;
    let title = req.params.title;

    try {
        let data = { fileId, title };
        let file = await File.rename(data);
        return res.status(200).json({ payload: file.toJSON(), message: 'File Renamed Successfully.' });

    } catch (e) {
        
        return res.status(500).json({ errors: { message: e.toString() } });
    }
}

export async function getAllUserFiles(req, res, next) {
    const { id } = req.currentUser;

    const query = { userId: id };
    let limit = 300;
    let offset = 0;

    try {
        let files = await File.list(query, limit, offset);
        return res.status(200).json({ payload: files, message: 'Retrieve Files Successfully.' });
    
    } catch (e) {

        return res.status(500).json({ errors: { message: e.toString() } });
    }
}

export async function deleteFile(req, res, next) {
    let fileId = req.params.id;
 
    try {
        let file = await File.remove(fileId);
        let currentPath = path.join(__dirname, '../../../../public',file.path);

        if(fs.existsSync(currentPath)){
            fs.unlinkSync(currentPath);
        }

        return res.status(200).json({ payload: file.toJSON(), message: 'File remove Successfully.' });

    } catch (e) {
    
        return res.status(500).json({ errors: { message: e.toString() } });
    }
}

    /** Folder Section */
export async function createFolder(req, res, next) {
    const { id } = req.currentUser;

    try {
        const data = { id, title: req.body.title };
        let folder = await Folder.create(data);
        return res.status(200).json({ payload: folder.toJSON(), message: 'Folder Create Successfully.' });

    } catch (e) {
    
        return res.status(500).json({ errors: { message: e.toString() } });
    }
}

export async function renameFolder(req, res, next) {
    let folderId = req.params.id;
    let title = req.params.title;

    try {
        let data = { folderId, title };
        let folder = await Folder.rename(data);

        return res.status(200).json({ payload: folder.toJSON(), message: 'Folder Renamed Successfully.' });

    } catch (e) {
        
        return res.status(500).json({ errors: { message: e.toString() } });
    }
}

export async function createSubfolder(req, res, next) {
    let folderId = req.params.id;

    try {
        const data = { folderId, title: req.body.title };

        let folder = await Folder.createSubfolder(data);
        return res.status(200).json({ payload: folder.toJSON(), message: 'Sub_Folder Created Successfully.' });
    
    } catch (e) {
    
        return res.status(500).json({ errors: { message: e.toString() } });
    }
}

export async function insertFile(req, res, next) {
    let folderId = req.params.id;

    try {

        let files = req.files;
        let filecreate;
            for (const file of files) {

                const { originalname, path, filename, mimetype, size, fieldname } = file;
                let detail = {
                    title: originalname,
                    name: filename,
                    path: `/uploads/${file.filename}`,
                    type: mimetype,
                    size
                };
                filecreate = await Folder.insertFile(detail, folderId);
            }
            return res.status(200).json({ payload: filecreate, message: 'File Create Successfully.' });

    } catch (e) {

        return res.status(500).json({ errors: { message: e.toString() } });
    }
}

export async function getUserFolders(req, res, next) {
    const { id } = req.currentUser;
    let query = { userId: id };
    let limit = 300;
    let offset = 0;

    try {
        let list = await Folder.list(id, limit, offset);
        console.log(list)
        // let folders = [...list[0]];
        return res.status(200).json({ payload: list, message: 'Folder List Retrieved Successfully.' });

    } catch (e) {
    
        return res.status(500).json({ errors: { message: e.toString() } });
    }
}

export async function deleteAFolderFile(req, res, next) {
    // const { folderId, fileId } = req.params;

    try {
        let removedFile = await Folder.removeAFolderFile(req.params);
        console.log(removedFile);
        return res.status(200).json({ payload: removedFile, message: 'File deleted Successfully.' });

    } catch (e) {
    
        return res.status(500).json({ errors: { message: e.toString() } });
    }
}

export async function deleteFolder(req, res, next) {
    let folderId = req.params.id;

    try {
        let folder = await Folder.removeFolder(folderId);
        // for (const file of folder.files) {
        //     file.remove(file.id);
        // }
        return res.status(200).json({ payload: folder.toJSON(), message: 'Folder deleted Successfully.' });

    } catch (e) {

        return res.status(500).json({ errors: { message: e.toString() } });
    }
}

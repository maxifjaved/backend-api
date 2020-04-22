import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
// import * as validation from './gallery.validation';

const File = mongoose.model('File');
const Folder = mongoose.model('Folder');
const User = mongoose.model('User');

    /** File Section */

    // TODO: // create directory file
export async function createFile(req, res, next) {
    const { id } = req.currentUser;
    const { data } = req.files[0];
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
            }
            return res.status(200).json({ payload: filecreate.toJSON(), message: 'File Create Successfully.' });

    } catch (e) {

        return res.status(500).json({ errors: { message: e.toString() } });
    }
}

    // TODO: // rename selected directory file
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

    // TODO: // get all directory files of user
export async function getDirectoryFiles(req, res, next) {
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
    // TODO: // delete specific file including link
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

    // TODO: // create empty directory folder
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

   // TODO: // rename selected folder
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

    // TODO: // create subfolder in selected folder
export async function createSubfolder(req, res, next) {
    let folderId = req.params.id;

    try {
        const data = { folderId, title: req.body.title };

        let folder = await Folder.createChildFolder(data);
        return res.status(200).json({ payload: folder.toJSON(), message: 'Sub_Folder Created Successfully.' });
    
    } catch (e) {
    
        return res.status(500).json({ errors: { message: e.toString() } });
    }
}

   // TODO: // Insert file in selected folder
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
                filecreate = await File.create(detail);
                await Folder.insertFileLinkInFolder(folderId, filecreate.id);
            }
            return res.status(200).json({ payload: filecreate, message: 'File Create Successfully.' });

    } catch (e) {

        return res.status(500).json({ errors: { message: e.toString() } });
    }
}

   // TODO: // get User`s directory and folders including files
export async function getUserFoldersAndFiles(req, res, next) {
    const { id } = req.currentUser;
    let query = { userId: id };
    let limit = 300;
    let offset = 0;

    try {
        let list = await Folder.list(query, limit, offset);
        let list2 = await File.list(query, limit, offset);
        let folders = [...list[0]];
        folders[1] = [...list2[0]];
        return res.status(200).json({ payload: folders, message: 'Folder List Retrieved Successfully.' });

    } catch (e) {
    
        return res.status(500).json({ errors: { message: e.toString() } });
    }
}

    // TODO: //  not used but may be in near future
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
    // TODO: // delete folder including files (NEED Restructuring Any Suggestion will be Highly Appriciated)
export async function deleteFolder(req, res, next) {
    let folderId = req.params.id;

    try {
        let folder = await Folder.removeFolder(folderId);
        if(!folder) {
            return res.status(404).json({ payload: [], message: 'Folder Not Exist.' });

        }
        for (const file of folder.files) {
            await File.remove(file.id);
            let currentPath = path.join(__dirname, '../../../../public',file.path);

            if(fs.existsSync(currentPath)){
                fs.unlinkSync(currentPath);
            }
        }
        return res.status(200).json({ payload: folder.toJSON(), message: 'Folder deleted Successfully.' });

    } catch (e) {

        return res.status(500).json({ errors: { message: e.toString() } });
    }
}

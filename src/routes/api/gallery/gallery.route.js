import { Router } from 'express';
import * as controller from './gallery.controller';
import { uploader } from '../../../helper/index';

const router = Router();

    /** File Section*/
router
    .get('/all-files', controller.getAllUserFiles)
    .post('/create-file', uploader, controller.createFile)
    .patch('/rename-file/:id/:title', controller.renameFile)
    .delete('/remove-file/:id', controller.deleteFile);

    /** Folder Section */
router
    .get('/all-folders', controller.getUserFolders)
    .post('/create-folder', controller.createFolder)
    .post('/create-subfolder/:id', controller.createSubfolder)
    .post('/insert-file/:id', uploader, controller.insertFile)
    .patch('/rename-folder/:id/:title', controller.renameFolder)
    .delete('/remove-folder-file/:folderId/:fileId', controller.deleteAFolderFile)
    .delete('/remove-folder/:id', controller.deleteFolder);

export default router;

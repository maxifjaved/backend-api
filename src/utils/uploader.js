import crypto from 'crypto'
import path from 'path'
import multer from 'multer'

const DEFAULT_UPLOAD_PATH = path.join(__dirname, '/../../public/uploads');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DEFAULT_UPLOAD_PATH);
    },
    filename: function (req, file, cb) {
        let customFileName = crypto.randomBytes(18).toString('hex'),
            originalname = file.originalname,
            fileExtension = originalname.substring(originalname.lastIndexOf('.') + 1, originalname.length) || originalname;
        cb(null, customFileName + '.' + fileExtension)
    }
});

const uploader = multer({ storage }).any();
export default uploader;

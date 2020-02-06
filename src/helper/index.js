// import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import path from 'path'
import multer from 'multer'

const DEFAULT_UPLOAD_PATH = path.join(__dirname, '/../../public/uploads');


// export function usernameIsValid(username = '') {
//     return /^[0-9a-zA-Z_.-_]+$/.test(username);
// }

// export async function decodToken(token, secrect) {
//     try {
//         return await jwt.verify(token, secrect)
//     } catch (error) {
//         throw new Error(error)
//     }
// }

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

export const uploader = multer({ storage }).any();
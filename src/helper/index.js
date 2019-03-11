import jwt from 'jsonwebtoken';
// import crypto from 'crypto'
// import path from 'path'
import multer from 'multer'
import cloudinary from 'cloudinary'
import cloudinaryStorage from 'multer-storage-cloudinary'


// const DEFAULT_UPLOAD_PATH = path.join(__dirname, '/../../public/uploads')


export function usernameIsValid(username = '') {
    return /^[0-9a-zA-Z_.-]+$/.test(username);
}

export async function decodToken(token, secrect) {
    try {
        return await jwt.verify(token, secrect)
    } catch (error) {
        throw new Error(error)
    }
}

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, DEFAULT_UPLOAD_PATH);
//     },
//     filename: function (req, file, cb) {
//         let customFileName = crypto.randomBytes(18).toString('hex'),
//             originalname = file.originalname,
//             fileExtension = originalname.substring(originalname.lastIndexOf('.') + 1, originalname.length) || originalname;
//         cb(null, customFileName + '.' + fileExtension)
//     }
// })

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "weynon",
    allowedFormats: ["jpg", "png", "mp4"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
});


export const uploader = multer({ storage }).any();
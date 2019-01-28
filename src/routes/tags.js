import { Router } from 'express';
import mongoose from 'mongoose';
import authenticate from '../middlewares/authenticate'

const UserPost = mongoose.model('UserPost');

const router = Router();

// return a list of tags
router.get('/', authenticate, function (req, res, next) {
    UserPost.find().distinct('tagList').then(function (tags) {
        return res.status(200).json({ tags: tags });
    }).catch((error) => {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    });
});


export default router;
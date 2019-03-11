import { Router } from 'express';
import mongoose from 'mongoose';
const UserPost = mongoose.model('UserPost');

import { uploader } from '../helper'

import authenticate from '../middlewares/authenticate'
import { newPost } from '../validations/posts'
import { isImageOrVideo } from '../validations/uploads'
import { getUserById } from '../db/controllers/user'


const router = Router();

router.get('/', authenticate, function (req, res, next) {
    const { id } = req.currentUser;
    var query = { $or: [{ userIds: { "$in": id } }, { userIds: { $eq: [] } }] }
    var limit = 10;
    var offset = 0;

    if (typeof req.query.limit !== 'undefined') {
        limit = req.query.limit;
    }

    if (typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
    }

    if (typeof req.query.tag !== 'undefined' && req.query.tag) {
        query = { ...query, $and: [{ tagList: { "$in": req.query.tag } }] };
    }

    Promise.all([
        UserPost.find(query)
            .limit(Number(limit))
            .skip(Number(offset))
            .sort({ createdAt: 'desc' })
            .populate('user')
            .exec(),

        UserPost.count(query).exec(),
    ]).then(function (results) {
        var posts = results[0];
        var postCount = results[1];

        return res.status(200).json({ posts, postCount })
    }).catch((error) => {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })

    });
});


router.post('/', authenticate, uploader, async function (req, res, next) {
    try {
        const { id } = req.currentUser

        const { errors, isValid } = newPost(req.body)
        if (!isValid) { return res.status(500).json({ errors }) }

        let files = req.files;
        if (!files.length) { return res.status(500).json({ errors: { attachment: 'Video/ Image attachment is required.' } }) }

        let attachment = files[0];
        let attachmentError = isImageOrVideo(attachment)
        if (!attachmentError.isValid) { return res.status(500).json({ errors: attachmentError }) }

        const user = await getUserById(id)
        const { title, place, description, tagList, userIds } = req.body
        let newUserPost = new UserPost();
        newUserPost.title = title
        newUserPost.place = place
        newUserPost.description = description
        if (tagList) {
            newUserPost.tagList = tagList.split(',').map(s => s.trim())
        }

        if (userIds) {
            newUserPost.userIds = userIds.split(',').map(s => s.trim())
        }

        newUserPost.attachmentUrl = attachment.secure_url
        newUserPost.attachmentPublicId = attachment.public_id
        newUserPost.user = user;


        await newUserPost.save()

        user.postId = newUserPost._id;
        await user.save();

        return res.status(200).json({ post: newUserPost.toJSONFor(user) })
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

router.get('/taged-post', authenticate, uploader, async function (req, res, next) {
    const { id } = req.currentUser;
    var query = { userIds: { "$in": id } }
    var limit = 10;
    var offset = 0;

    if (typeof req.query.limit !== 'undefined') {
        limit = req.query.limit;
    }

    if (typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
    }



    Promise.all([
        UserPost.find(query)
            .limit(Number(limit))
            .skip(Number(offset))
            .sort({ createdAt: 'desc' })
            .populate('user')
            .exec(),

        UserPost.count(query).exec(),
    ]).then(function (results) {
        var posts = results[0];
        var postCount = results[1];

        return res.status(200).json({ posts, postCount })
    }).catch((error) => {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })

    });
});

router.get('/my', authenticate, uploader, async function (req, res, next) {

    const { id } = req.currentUser;
    var query = { user: id }
    var limit = 10;
    var offset = 0;

    if (typeof req.query.limit !== 'undefined') {
        limit = req.query.limit;
    }

    if (typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
    }

    Promise.all([
        UserPost.find(query)
            .limit(Number(limit))
            .skip(Number(offset))
            .sort({ createdAt: 'desc' })
            .populate('user')
            .exec(),

        UserPost.count(query).exec(),
    ]).then(function (results) {
        var posts = results[0];
        var postCount = results[1];

        return res.status(200).json({ posts, postCount })
    }).catch((error) => {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })

    });
});

export default router;
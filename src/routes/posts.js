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
    // var query = {};
    // var limit = 20;
    // var offset = 0;

    // if (typeof req.query.limit !== 'undefined') {
    //     limit = req.query.limit;
    // }

    // if (typeof req.query.offset !== 'undefined') {
    //     offset = req.query.offset;
    // }

    // if (typeof req.query.tag !== 'undefined') {
    //     query.tagList = { "$in": [req.query.tag] };
    // }

    // Promise.all([
    //     req.query.author ? User.findOne({ username: req.query.author }) : null,
    //     req.query.favorited ? User.findOne({ username: req.query.favorited }) : null
    // ]).then(function (results) {
    //     var author = results[0];
    //     var favoriter = results[1];

    //     if (author) {
    //         query.author = author._id;
    //     }

    //     if (favoriter) {
    //         query._id = { $in: favoriter.favorites };
    //     } else if (req.query.favorited) {
    //         query._id = { $in: [] };
    //     }

    //     return Promise.all([
    //         Article.find(query)
    //             .limit(Number(limit))
    //             .skip(Number(offset))
    //             .sort({ createdAt: 'desc' })
    //             .populate('author')
    //             .exec(),
    //         Article.count(query).exec(),
    //         req.payload ? User.findById(req.payload.id) : null,
    //     ]).then(function (results) {
    //         var articles = results[0];
    //         var articlesCount = results[1];
    //         var user = results[2];

    //         return res.json({
    //             articles: articles.map(function (article) {
    //                 return article.toJSONFor(user);
    //             }),
    //             articlesCount: articlesCount
    //         });
    //     });
    // }).catch(next);
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
        const { title, place, description } = req.body
        let newUserPost = new UserPost();
        newUserPost.title = title
        newUserPost.place = place
        newUserPost.description = description
        newUserPost.attachment = `/uploads/${attachment.filename}`
        newUserPost.user = user;

        await newUserPost.save()
        return res.status(200).json({ post: newUserPost.toJSONFor() })
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }

    // User.findById(req.payload.id).then(function (user) {
    //     if (!user) { return res.sendStatus(401); }

    //     var article = new Article(req.body.article);

    //     article.author = user;

    //     return article.save().then(function () {
    //         console.log(article.author);
    //         return res.json({ article: article.toJSONFor(user) });
    //     });
    // }).catch(next);
});


export default router;
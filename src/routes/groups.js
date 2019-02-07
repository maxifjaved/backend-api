import { Router } from 'express';
import mongoose from 'mongoose';

import { newGroup, groupIdValidation } from '../validations/userGroup'
import authenticate from '../middlewares/authenticate'

const UserGroup = mongoose.model('userGroup');
const User = mongoose.model('User');

const router = Router();


router.get('/getAllGroups', authenticate, async (req, res, next) => {
    var query = {};
    var limit = 20;
    var offset = 0;

    if (typeof req.query.limit !== 'undefined') {
        limit = req.query.limit;
    }

    if (typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
    }

    Promise.all([
        UserGroup.find(query)
            .limit(Number(limit))
            .skip(Number(offset))
            .sort({ createdAt: 'desc' })
            .populate('groupMembers')
            .exec(),

        UserGroup.count(query).exec(),
    ]).then(function (results) {
        var group = results[0];
        var groupCount = results[1];

        return res.status(200).json({ group, groupCount })
    })
});

router.post('/getGroupDetail', authenticate, async (req, res, next) => {
    try {
        const { errors, isValid } = await groupIdValidation(req.body)
        if (!isValid) { return res.status(500).json({ errors }) }

        let { groupId } = req.body

        Promise.all([
            UserGroup.find({ _id: groupId })
                .populate('userId')
                .exec(),
        ]).then(function (results) {

            return res.status(200).json({ userGroupDetail: results[0] })
        })
    } catch (error) {
        return res.status(500).json({ errors: err.toString() })
    }


});

router.post('/updateGroup', authenticate, async (req, res, next) => {

    try {
        const { errors, isValid } = await newGroup(req.body)
        if (!isValid) { return res.status(500).json({ errors }) }
        const { groupTitle, groupId, groupMembers } = req.body;

        if (groupMembers.length > 0) {

            let group = await UserGroup.findById({ _id: groupId })
            group.groupTitle = groupTitle;

            for (let i = 0; i < groupMembers.length; i++) {
                group.groupMembers.push(groupMembers[i])
            }
            await group.save();

            return res.status(200).json(group)
        } else {
            return res.status(500).json({ errors: 'GroupMembers parameter missing' })
        }
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});



router.get('/getGroupUsers', authenticate, async (req, res, next) => {
    const { id } = req.currentUser

    try {
        let groupUsers = await User.findOne({ _id: id })
            .populate('groupId')
            .lean()
            .exec()

        let group = await UserGroup.populate(groupUsers.groupId, { path: 'groupMembers' });

        return res.status(200).json({ group: group })
    } catch (error) {
        return res.status(500).json({ errors: error.toString() })
    }
});



export default router;
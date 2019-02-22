import { Router } from 'express';
import mongoose from 'mongoose';

import { newGroup, groupIdValidation, newUserGroup, changeGroup } from '../validations/userGroup'
import authenticate from '../middlewares/authenticate'

const UserGroup = mongoose.model('Group');
const User = mongoose.model('User');
const Friend = mongoose.model('Friend');

const router = Router();


router.get('/get-all-groups', authenticate, async (req, res, next) => {
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

router.post('/get-group-detail', authenticate, async (req, res, next) => {
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

router.post('/update-group', authenticate, async (req, res, next) => {

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
router.get('/get-group-users', authenticate, async (req, res, next) => {
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

router.post('/create-new-group', authenticate, async (req, res, next) => {
    try {
        const { errors, isValid } = await newUserGroup(req.body)
        if (!isValid) { return res.status(500).json({ errors }) }
        const { groupTitle, groupMembers } = req.body;
        const { id } = req.currentUser
        if (groupMembers.length > 0) {

            let group = new UserGroup();
            group.groupTitle = groupTitle;
            group.userId = id;

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

router.get('/user-all-groups', authenticate, async (req, res, next) => {
    try {
        const { id } = req.currentUser

        let groups = await UserGroup.find({ userId: id })

        return res.status(200).json(groups)
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

router.post('/change-group', authenticate, async (req, res, next) => {
    try {
        const { errors, isValid } = await changeGroup(req.body)
        if (!isValid) { return res.status(500).json({ errors }) }

        let { userId, groupId } = req.body
        
        let friendObj = await Friend.findOne({ friend: userId })
        if (!friendObj) return res.status(500).json({ message: 'There is no user group with given groupId' })
        
        friendObj.group = groupId;
        await friendObj.save();

        return res.status(200).json({ message: 'User group chenged successfully.' })
    } catch (error) {
        return res.status(500).json({ errors: err.toString() })
    }


});

export default router;
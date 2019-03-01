import { Router } from 'express';
import mongoose from 'mongoose'
import {
    getAllFriends, createNewFriend
} from '../db/controllers/friend'
import { isUserExists, getUserById } from '../db/controllers/user'
import { isFriendExists } from '../db/controllers/friend'
import { isGroupExists, getUserGroupById } from '../db/controllers/group'
import authenticate from '../middlewares/authenticate'
import { validateFriend } from '../validations/friends'

const router = Router();



router.get('/', authenticate, async (req, res, next) => {

    const { id } = req.currentUser;
    var query = { user: id };
    var limit = 20;
    var offset = 0;

    if (typeof req.query.limit !== 'undefined') {
        limit = req.query.limit;
    }
    if (typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
    }

    try {
        let results = await getAllFriends(query, limit, offset);
        return res.status(200).json({ friends: results[0], total: results[1] })
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});


router.post('/invite', authenticate, async (req, res, next) => {
    const { id: currentUserId } = req.currentUser

    let { errors, isValid } = validateFriend(req.body);
    if (!isValid) { return res.status(500).json({ errors }) }

    const { groupId, userId: friendId } = req.body;
    if (currentUserId == friendId) { return res.status(500).json({ errors: { userId: 'You can\'t add yourself as friend' } }) }

    try {
        let cuser = await getUserById(currentUserId);

        let fuser = await getUserById(friendId);
        if (!fuser) { return res.status(500).json({ errors: { userId: 'Invalid User Id' } }) }

        let group = await getUserGroupById(groupId);
        if (!group) { return res.status(500).json({ errors: { groupId: 'Invalid Group Id' } }) }

        let friends = await getAllFriends({ $and: [{ user: currentUserId }, { friend: friendId }] })
        if (friends.length) { return res.status(500).json({ errors: { message: 'You already invited this user.', friends: friends[0] } }) }

        let result = await createNewFriend({ currentUserId, friendId, groupId })

        cuser.friends.push(result[0]);
        await cuser.save();

        fuser.friends.push(result[1]);
        await fuser.save();

        return res.status(200).json({ message: 'Friend requeste sent successfully.', invited: result[0] });
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
    // var query = { user: id }
    // var limit = 20;
    // var offset = 0;

    // if (typeof req.query.limit !== 'undefined') {
    //     limit = req.query.limit;
    // }
    // if (typeof req.query.offset !== 'undefined') {
    //     offset = req.query.offset;
    // }

    // try {
    //     let results = await getAllInvitations(query, limit, offset)
    //     return res.status(200).json({ invitations: results[0], total: results[1] })
    // } catch (error) {
    //     return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    // }
})

export default router;
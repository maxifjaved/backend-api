import { Router } from 'express';
import mongoose from 'mongoose'
import {
    getAllFriends, createNewFriend
} from '../db/controllers/friend'
import { isUserExists, getUserById } from '../db/controllers/user'
import { isFriendExists, getFriendByQuery } from '../db/controllers/friend'
import { isGroupExists, getUserGroupById } from '../db/controllers/group'
import authenticate from '../middlewares/authenticate'
import { validateFriend, validateDeleteFriendRequest } from '../validations/friends'

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

    if (typeof req.query.status !== 'undefined' && req.query.status !== '') {
        query.status = req.query.status;
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

        let results = await getAllFriends({ $and: [{ user: currentUserId }, { friend: friendId }] })

        let friends = results[0];
        if (friends.length) { return res.status(500).json({ errors: { message: 'You already invited this user.', friends: friends } }) }

        let result = await createNewFriend({ currentUserId, friendId, groupId })

        cuser.friends.push(result[0]);
        await cuser.save();

        fuser.friends.push(result[1]);
        await fuser.save();

        return res.status(200).json({ message: 'Friend requeste sent successfully.', invited: result[0] });
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
})

router.post('/friend', authenticate, async (req, res, next) => {
    const { id: currentUserId } = req.currentUser

    let { errors, isValid } = validateFriend(req.body);
    if (!isValid) { return res.status(500).json({ errors }) }

    const { groupId, userId: friendId } = req.body;
    if (currentUserId == friendId) { return res.status(500).json({ errors: { userId: 'You can\'t add yourself as friend' } }) }

    try {
        let friend = await getFriendByQuery({ $and: [{ user: currentUserId }, { friend: friendId }, { status: 'friend' }] })
        if (friend) { return res.status(500).json({ errors: { message: 'You are already friends.' } }) }


        let group = await getUserGroupById(groupId);
        if (!group) { return res.status(500).json({ errors: { groupId: 'Invalid Group Id' } }) }

        let friendRequest = await getFriendByQuery({ $and: [{ user: currentUserId }, { friend: friendId }, { status: 'request' }] })
        if (!friendRequest) { return res.status(500).json({ errors: { message: 'Not requested from friendship.' } }) }

        let inviteRequest = await getFriendByQuery({ $and: [{ user: friendId, }, { friend: currentUserId }, { status: 'invite' }] })
        if (!inviteRequest) { return res.status(500).json({ errors: { message: 'Not invited for friendship.' } }) }


        friendRequest.group = groupId;
        friendRequest.status = 'friend';
        await friendRequest.save();

        inviteRequest.status = 'friend';
        await inviteRequest.save();

        return res.status(200).json({ message: 'Friend added successfully.', friend: friendRequest });
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
})

router.delete('/friend', authenticate, async (req, res, next) => {
    const { id: currentUserId } = req.currentUser

    let { errors, isValid } = validateDeleteFriendRequest(req.body);
    if (!isValid) { return res.status(500).json({ errors }) }

    const { userId: friendId } = req.body;
    if (currentUserId == friendId) { return res.status(500).json({ errors: { userId: 'You can\'t remove yourself from friend list' } }) }

    try {
        let friend = await getFriendByQuery({ $and: [{ user: currentUserId }, { friend: friendId }] })
        if (!friend) { return res.status(500).json({ errors: { message: 'Invalid user details.' } }) }


        let friendOf = await getFriendByQuery({ $and: [{ user: friendId, }, { friend: currentUserId }] })
        if (!friendOf) { return res.status(500).json({ errors: { message: 'Invalid user details.' } }) }

        let cuser = await getUserById(currentUserId);
        let cindex = cuser.friends.indexOf(friend.id);

        let fuser = await getUserById(friendId);
        if (!fuser) { return res.status(500).json({ errors: { userId: 'Invalid User Id' } }) }
        let findex = fuser.friends.indexOf(friendOf.id);

        cuser.friends.splice(cindex, 1);
        await cuser.save();

        fuser.friends.splice(findex, 1);
        await fuser.save();

        await friend.remove();
        await friendOf.remove();
        return res.status(200).json({ message: 'Request proccessed successfully.' });
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
})


export default router;
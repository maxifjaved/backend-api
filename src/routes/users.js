import { Router } from 'express';

// import * as userController from '../controllers/users';
// import { findUser, userValidator } from '../validators/userValidator';
import authenticate from '../middlewares/authenticate'
import { getAllUsers, getUserById, deleteUserById } from '../db/controllers/user'

const router = Router();


router.get('/', authenticate, async (req, res, next) => {

    try {
        let users = await getAllUsers()
        return res.status(200).json({ users: users })
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

router.get('/:id', authenticate, async (req, res, next) => {
    const { id } = req.params;
    try {
        let user = await getUserById(id)
        return res.status(200).json({ user: user.toJSON() });
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});
router.delete('/:id', async function (req, res, next) {
    const { id } = req.params;

    try {
        await deleteUserById(id)
        return res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

router.get('/:userId/friends', authenticate, async function (req, res, next) {
    const { userId } = req.params;
    const { id } = req.currentUser

    try {
        let user = await getUserById(id)
        let addFriend = await getUserById(userId)
        if (!addFriend) { return res.status(500).json({ errors: { message: 'Invalid User Id.' } }) };

        user.addFriend(userId).then(function () {
            return res.status(200).json({ user: user.toProfileJSONFor(user), message: 'User added to friends successfylly.' });
        }).catch((error) => {
            return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
        });
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

router.delete('/:userId/friends', authenticate, async function (req, res, next) {
    const { userId } = req.params;
    const { id } = req.currentUser

    try {
        let user = await getUserById(id)
        let addFriend = await getUserById(userId)
        if (!addFriend) { return res.status(500).json({ errors: { message: 'Invalid User Id.' } }) };

        user.unFriend(userId).then(function () {
            return res.status(200).json({ user: user.toProfileJSONFor(user), message: 'User remove from friends successfylly.' });
        }).catch((error) => {
            return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
        });
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

router.get('/:userId/requset-friendship', authenticate, async function (req, res, next) {
    const { userId } = req.params;
    const { id } = req.currentUser

    try {
        let user = await getUserById(id)
        let addFriend = await getUserById(userId)
        if (!addFriend) { return res.status(500).json({ errors: { message: 'Invalid User Id.' } }) };

        user.friendshipRequest(userId).then(function () {
            return res.status(200).json({ user: user.toProfileJSONFor(user), message: 'Friend requeste sent successfylly.' });
        }).catch((error) => {
            return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
        });
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

router.delete('/:userId/requset-friendship', authenticate, async function (req, res, next) {
    const { userId } = req.params;
    const { id } = req.currentUser

    try {
        let user = await getUserById(id)
        let addFriend = await getUserById(userId)
        if (!addFriend) { return res.status(500).json({ errors: { message: 'Invalid User Id.' } }) };

        user.removeRequestFriendship(userId).then(function () {
            return res.status(200).json({ user: user.toProfileJSONFor(user), message: 'Deleted friend request successfylly.' });
        }).catch((error) => {
            return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
        });
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});


export default router;
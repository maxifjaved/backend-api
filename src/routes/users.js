import { Router } from 'express';

// import * as userController from '../controllers/users';
// import { findUser, userValidator } from '../validators/userValidator';
import authenticate from '../middlewares/authenticate'
import { getAllUsers, getUserById } from '../db/controllers/user'

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

export default router;
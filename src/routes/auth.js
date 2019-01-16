import { Router } from 'express';
import passport from "passport";
import authenticate from '../middlewares/authenticate';

// import * as userController from '../controllers/users';
// import { findUser, userValidator } from '../validators/userValidator';

const router = Router();
const User = mongoose.model('User');

router.post('/login-via-local', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return res.status(400).json({ errors: { error: err, message: 'Internal Server Error. Contact Administrator for more information.' } }) };
        if (info) { return res.status(500).json({ errors: info }) };

        return res.status(200).json({ user });
    })(req, res, next)
})

router.get('/refresh-token', authenticate, (req, res) => {
    const { id } = req.currentUser

    User.findById(id, (err, user) => {
        if (err) { return res.status(400).json({ errors: { error: err, message: 'Internal Server Error. Contact Administrator for more information.' } }) };
        if (!user) { return res.status(404).json({ errors: { form: 'Invalid User Token.' } }) };
        return res.status(200).json({ user: user.toAuthJSON() })
    });
});

router.get('reset-password/:identifier', (req, res) => {
    const { identifier } = req.params;

    User.findOne({ $or: [{ username: identifier.toLowerCase() }, { email: identifier.toLowerCase() }] }, (err, user) => {
        if (err) { return res.status(400).json({ errors: { error: err, message: 'Internal Server Error. Contact Administrator for more information.' } }) };

        if (!user) return res.status(404).json({ errors: { message: 'User with such email/username doesn\'t exist in system.' } });

        return res.status(200).json({ message: 'Send reset email is not implimented yet it is still inporgress...' })
    });
});

router.get('/currentUser', authenticate, (req, res) => {
    const { id } = req.currentUser

    User.findById(id, (err, user) => {
        if (err) { return res.status(400).json({ errors: { error: err, message: 'Internal Server Error. Contact Administrator for more information.' } }) };
        if (!user) { return res.status(404).json({ errors: { form: 'Invalid User Token.' } }) };
        return res.status(200).json({ user: user.toJSON() })
    });
});

export default router;
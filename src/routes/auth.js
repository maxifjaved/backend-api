import mongoose from 'mongoose'
import { Router } from 'express';
import passport from "passport";
import authenticate from '../middlewares/authenticate';
import { signup } from '../validations/auth'
// import * as userController from '../controllers/users';
// import { findUser, userValidator } from '../validators/userValidator';

const router = Router();
const User = mongoose.model('User');

function validateInput(data, otherValidations) {
    const { errors } = otherValidations(data);

    const p = new Promise((resolve, reject) => {
        User.findOne({
            $or: [
                {
                    email: data.email,
                }, {
                    username: data.username,
                },
            ],
        }, (err, user) => {
            if (err) { reject(err); }

            if (user) {
                if (user.get('username') === data.username) {
                    errors.username = 'There is user with such username';
                }
                if (user.get('email') === data.email) {
                    errors.email = 'There is user with such email';
                }
                reject({ errors, isValid: isEmpty(errors) });
            } else {
                resolve({ errors, isValid: isEmpty(errors) });
            }
        });
    });
    return p;
}



router.post('/signup', async (req, res, next) => {
    validateInput(req.body, signup).then(({ errors, isValid }) => {
        if (isValid) {
            const { username, email, password } = req.body;
            try {
                let user = new User();
                user.username = username;
                user.email = email;
                user.setPassword(password);
                await user.save();

                return res.status(200).json({ user: user.toAuthJSON() })
            } catch (error) {

            }
        }

        // 
    }).catch(({ errors }) => {
        res
            .status(403)
            .json(errors);
    });



    // user.save().then(function () {
    //   return res.json({ user: user.toAuthJSON() });
    // }).catch(next);

})


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
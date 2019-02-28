import { Router } from 'express'
import passport from "passport"

import authenticate from '../middlewares/authenticate'
import {
    signup, phoneVerification, phoneVerificationDB, phoneVerificationCode,
    login, resetPassword, resetPasswordPhone, validateUpdateProfile
} from '../validations/auth'
import { checkFileType } from '../validations/uploads'

import { createNewUser, updateUserById, getUserById, getUserByIdentifier } from '../db/controllers/user'
import { createUserToken, updateUserToken, deleteUserTokenById } from '../db/controllers/userToken'
import { getAllUserGroups } from '../db/controllers/group'
import { decodToken, uploader } from '../helper'
import { sendResetPasswordEmail } from '../mailer'

const router = Router();



router.post('/signup', async (req, res, next) => {
    try {
        const { errors, isValid } = await signup(req.body)
        if (!isValid) { return res.status(500).json({ errors }) }

        let user = await createNewUser(req.body)
        return res.status(200).json({ user: user.toAuthJSON() })
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
})

router.post('/send-phone-verification-code', authenticate, async (req, res, next) => {
    try {
        let phoneValidationError = phoneVerification(req.body)
        if (!phoneValidationError.isValid) { return res.status(500).json({ errors: phoneValidationError.errors }) }

        const { id } = req.currentUser

        let { errors, isValid } = await phoneVerificationDB(req.body, id)
        if (!isValid) { return res.status(500).json({ errors }) }

        const { phonenumber } = req.body
        await updateUserById(id, { phonenumber })
        await createUserToken(id, 'phone-confirmation');

        return res.status(200).json({ message: `Verification code is send to your number successfully. ` })
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
})

router.get('/resend-phone-verification-code', authenticate, async (req, res, next) => {
    try {
        const { id } = req.currentUser
        await createUserToken(id, 'phone-confirmation');

        return res.status(200).json({ message: `Verification code is send to your number successfully.` })
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
})

router.post('/confirm-phone-verification-code', authenticate, async (req, res, next) => {
    let { errors, isValid } = phoneVerificationCode(req.body)
    if (!isValid) { return res.status(500).json({ errors }) }

    try {
        const { id } = req.currentUser
        const { isValid, errors } = await updateUserToken(req.body, 'phone-confirmation');
        if (!isValid) { return res.status(500).json({ errors }) }

        await updateUserById(id, { phoneVerified: true })
        return res.status(200).json({ message: `Your phone number verified successfully.` })
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
})


router.post('/login-via-local', (req, res, next) => {
    try {
        const { errors, isValid } = login(req.body)
        if (!isValid) { return res.status(500).json({ errors }) }

        passport.authenticate('local', (err, user, info) => {
            if (err) { return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' }) };
            if (info) { return res.status(500).json({ errors: info }) };
            return res.status(200).json({ user });
        })(req, res, next)
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
})




router.get('/refresh-token', authenticate, async (req, res, next) => {
    const { id } = req.currentUser

    try {
        let user = await getUserById(id)
        if (!user) { return res.status(500).json({ errors: { message: 'Invalid User Token.' } }) };

        return res.status(200).json({ user: user.toAuthJSON() })
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

router.get('/confirm-email/:token', async (req, res) => {
    const { token } = req.params;

    try {
        let decodedToken = await decodToken(token, process.env.CONFIRMATION_EMAIL_SECRET)
        let { id } = decodedToken;
        await updateUserById(id, { emailVerified: true })
        return res.status(200).json({ message: 'Your email verifed successfully.' })

    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

router.get('/send-reset-password-email/:identifier', async (req, res) => {
    const { identifier } = req.params;

    try {
        let user = await getUserByIdentifier(identifier);
        if (!user) { return res.status(404).json({ errors: { message: 'User with such email/username doesn\'t exist in system.' } }); }
        await sendResetPasswordEmail(user)
        return res.status(200).json({ message: 'Password reset request proccessed successfully. Check your email.' })
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

router.get('/send-reset-password-token-to-phone/:identifier', async (req, res) => {
    const { identifier } = req.params;

    try {
        let user = await getUserByIdentifier(identifier);
        if (!user) { return res.status(404).json({ errors: { message: 'User with such email/username or phone doesn\'t exist in system.' } }); }

        if (!user.phonenumber) { return res.status(404).json({ errors: { message: 'No phone number exists aginsts your account' } }); }

        if (!user.phoneVerified) { return res.status(404).json({ errors: { message: 'Your phone is not verified. Please verify your phone first.' } }); }

        await createUserToken(user.id, 'phone-reset-password');

        return res.status(200).json({ message: `Reset password code is send to your number successfully. ` })
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});


router.post('/new-password-email/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const { errors, isValid } = resetPassword(req.body)
        if (!isValid) { return res.status(500).json({ errors }) }
        let { password } = req.body
        let decodedToken = await decodToken(token, process.env.RESET_PASSWORD_SECRET)
        let { id } = decodedToken;

        await updateUserById(id, { password })
        return res.status(200).json({ message: 'Password reset successfully. Login with new password.' })
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

router.post('/new-password-phone', async (req, res) => {

    try {
        const { errors, isValid } = resetPasswordPhone(req.body)
        if (!isValid) { return res.status(500).json({ errors }) }
        let { password } = req.body

        const { errors: pError, isValid: pIsValid } = await updateUserToken(req.body, 'phone-reset-password');
        if (!pIsValid) { return res.status(500).json({ errors: pError }) }

        const { userToken } = tokenDetail
        await updateUserById(userToken.user, { password })
        await deleteUserTokenById(userToken.id);

        return res.status(200).json({ message: 'Password reset successfully. Login with new password.' })
    } catch (error) {
        return res.status(500).json({ errors: error.toString(), message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

router.get('/currentUser', authenticate, async (req, res) => {
    const { id } = req.currentUser

    try {
        let user = await getUserById(id)
        if (!user) { return res.status(500).json({ errors: { message: 'Invalid User Token.' } }) };

        let groups = await getAllUserGroups()
        return res.status(200).json({ user: user.toJSON(), groups })
    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

router.patch('/update-user-profile', authenticate, uploader, async (req, res) => {
    const { id } = req.currentUser

    try {
        let files = req.files
        if (files.length) {
            let photo = files[0];
            let { errors, isValid } = checkFileType(photo, 'image')
            if (!isValid) { return res.status(500).json({ errors }) }

            req.body.image = `/uploads/${photo.filename}`
        }

        let { errors: error1, isValid: isValid1 } = validateUpdateProfile(req.body)

        if (!isValid1) { return res.status(500).json({ errors: error1 }) }

        if (req.body.username) { delete req.body.username }
        if (req.body.email) { delete req.body.email }
        if (`${req.body.emailVerified}`) { delete req.body.emailVerified }
        if (`${req.body.phoneVerified}`) { delete req.body.phoneVerified }
        if (`${req.body.password}`) { delete req.body.password }


        await updateUserById(id, req.body)
        let updatedUser = await getUserById(id)
        return res.status(200).json({ user: updatedUser.toJSON() })

    } catch (error) {
        return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
    }
});

export default router;
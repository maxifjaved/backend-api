import { Router } from 'express'
import passport from 'passport'
import * as controller from './auth.controller'

const router = Router();

router
    .post('/signup', controller.signup)
    .post('/login-via-local', controller.login)
    .get('/verify-email/:token', controller.verifyEmail)
    .get('/forgot-password/:identifier', controller.verifyEmail);


// router.get('/send-reset-password-email/:identifier', async (req, res) => {
//     const { identifier } = req.params;
//     try {
//         let user = await getUserByIdentifier(identifier);
//         if (!user) { return res.status(404).json({ errors: { message: 'User with such email/username doesn\'t exist in system.' } }); }
//         await sendResetPasswordEmail(user)
//         return res.status(200).json({ message: 'Password reset request proccessed successfully. Check your email.' })
//     } catch (error) {
//         return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
//     }
// });

// router.get('/resetPassword/:identifier', async (req, res) => {
//     const { identifier } = req.params;
//     res.render('resetPassword', { title: 'Reset-Password', identifier })
// });

// router.post('/new-password-email', async (req, res) => {
//     const { token } = req.params;
//     try {
//         const { errors, isValid } = resetPassword(req.body)
//         if (!isValid) { return res.status(500).json({ errors }) }
//         let { password } = req.body
//         let decodedToken = await decodToken(token, process.env.RESET_PASSWORD_SECRET)
//         let { id } = decodedToken;
//         await updateUserById(id, { password })
//         return res.status(200).json({ message: 'Password reset successfully. Login with new password.' })
//     } catch (error) {
//         return res.status(500).json({ errors: { error: error.toString() }, message: 'Oops, something happen bad while proccessing your requset.' })
//     }
// });

export default router;
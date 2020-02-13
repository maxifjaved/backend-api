import mongoose from 'mongoose';
import passport from "passport"

const User = mongoose.model('User');
import * as validation from './auth.validation';

export async function signup(req, res, next) {
    const { errors, isValid } = await validation.signup(req.body)
    if (!isValid) { return res.status(500).json({ errors }) }

    try {
        let result = await User.createNew(req.body);
        return res.status(200).json({ payload: result.toAuthJSON(), message: 'User Signup Successfully.' });
    } catch (error) {
        return res.status(500).json({ errors: { message: error.toString() } });
    }
}

export async function login(req, res, next) {
    const { errors, isValid } = await validation.login(req.body)
    if (!isValid) { return res.status(500).json({ errors }) }

    try {
        passport.authenticate('local', (err, user, info) => {
            if (err) { return res.status(500).json({ errors: { message: err.toString() } }) };
            if (info) { return res.status(500).json({ errors: { message: info.toString() } }) };

            return res.status(200).json({ payload: user, message: 'User Login Successfully.' });
        })(req, res, next)

    } catch (error) {
        return res.status(500).json({ errors: { message: error.toString() } });
    }
}

export async function verifyEmail(req, res, next) {
    const { token } = req.params;

    try {
        let redirectUrl = await User.verifyEmail(token);
        return res.redirect(redirectUrl);
    } catch (error) {
        return res.status(500).json({ errors: { message: error.toString() } })
    }
}

    //TODO: render resetPassowrd page
export async function forgotPassword(req, res, next) {
    const { identifier } = req.params;

    try {
        res.render('resetPassword', { title: 'Reset-Password', identifier });
    
    } catch (e) {

        return res.status(500).json({ errors: { message: e.toString() } })
    }

}

export async function newPasswordEmail(req, res, next) {

    try {
        const { errors, isValid } = resetPassword(req.body);
        if (!isValid) { 
            return res.status(500).json({ message: "All Fields are required", errors });
        }
        
        

    } catch (e) {

        return res.status(500).json({ errors: { message: e.toString() } });
    }
}
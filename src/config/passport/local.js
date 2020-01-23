import mongoose from 'mongoose';
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

const User = mongoose.model('User');

export default passport.use(new LocalStrategy({
    usernameField: 'identifier',
    passwordField: 'password'
}, async (identifier, password, done) => {
    try {
        let user = await User.findByIdentifier(identifier);
        if (!user) return done(null, false, 'Invalid Credentials.');

        if (user && user.validPassword(password)) {
            return done(null, user.toAuthJSON());
        } else {
            return done(null, false, 'Invalid Credentials.');
        }
    } catch (error) {
        if (error) return done(error)
    }
}))
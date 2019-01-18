import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import { getUserByIdentifier } from '../db/controllers/user';

export default passport.use(new LocalStrategy({
    usernameField: 'identifier',
    passwordField: 'password'
}, async (identifier, password, done) => {
    try {
        let user = await getUserByIdentifier(identifier);
        if (!user) return done(null, false, { form: 'Invalid Credentials.' })

        if (user && user.validPassword(password)) {
            return done(null, user.toAuthJSON());
        } else {
            return done(null, false, { form: 'Invalid Credentials.' })
        }
    } catch (error) {
        if (err) return done(err)
    }
}))
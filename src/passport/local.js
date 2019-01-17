import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

const User = mongoose.model('User');

function passportLocal() {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (identifier, password, done) => {
        User.findOne({ $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }] }, (err, user) => {
            if (err) return done(err)

            if (!user) return done(null, false, { form: 'Invalid Credentials.' })

            if (user && user.validPassword(password)) {
                debugger
                return done(null, user.toAuthJSON());
            } else {
                return done(null, false, { form: 'Invalid Credentials.' })
            }

        })
    }))
}

export default passportLocal

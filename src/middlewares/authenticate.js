import mongoose from 'mongoose'
import jwt from 'jsonwebtoken';

const User = mongoose.model('User');


export default (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    var token;
    if (authorizationHeader) { token = authorizationHeader.split(' ')[1]; }

    if (!token) { return res.status(403).json({ errors: { form: 'No token provided' } }) };

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { return res.status(400).json({ errors: { error: err, message: 'Internal Server Error. Contact Administrator for more information.' } }) };
        User.findById(decoded.id, (err, user) => {
            if (err) { return res.status(400).json({ errors: { error: err, message: 'Internal Server Error. Contact Administrator for more information.' } }) };
            if (!user) { return res.status(404).json({ errors: { form: 'Invalid User Token.' } }) };

            req.currentUser = user.toJSON();
            next();
        });
    });

};

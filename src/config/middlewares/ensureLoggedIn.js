import { model } from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../config';

const User = model('User');

const ensureLoggedIn = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	const jwtToken = authHeader ? authHeader.split(' ')[1] : req.params.jwtToken;
	const jwtSecret = config.jwtSecret;

	if (!jwtToken) {
		return res
			.status(401)
			.json({
				message: 'Authentication failed. No token was provided.',
				errors: { message: 'Authentication failed.' }
			});
	}

	try {
		var decoded = jwt.verify(jwtToken, jwtSecret);
		let nsgUser = await User.getById(decoded.id);
		if (!nsgUser) {
			return res
				.status(404)
				.json({
					message: 'Sorry, we were unable to find you in our database.',
					errors: {
						message:
							'Sorry, we were unable to find you in our database. Contact Administrator for more information.'
					}
				});
		}

		req.currentUser = nsgUser.toJSON();
		next();
	} catch (err) {
		let nsgError = { message: '', errors: { message: err.message } };
		switch (err.name) {
			case 'TokenExpiredError':
				nsgError.message = 'Your login session has expired. Please login again.';
				break;
			case 'JsonWebTokenError':
				nsgError.message = 'Invalid token. Please login again.';
				break;
			case 'NotBeforeError':
				nsgError.message = 'Your session has not active yet. Please try again later.';
				break;
			default:
				nsgError.message = 'Something went wrong during processing your request, please try again.';
				break;
		}

		return res.status(500).json(nsgError);
	}
};

export default ensureLoggedIn;

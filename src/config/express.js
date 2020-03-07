import fs from 'fs';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import logger from 'morgan';
import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
const router = express.Router();

import config from './config';
import { validateJSON, ensureLoggedIn } from './middlewares';

/**Routes */
import { viewsRoutes, authRoutes, apiRoutes } from '../routes';

const app = express();
if (config.env === 'development') {
	app.use(logger('dev'));
}

try {
	fs.existsSync(path.join(__dirname, '/../../public')) || fs.mkdirSync(path.join(__dirname, '/../../public'));
	fs.existsSync(path.join(__dirname, '/../../public/uploads')) ||
		fs.mkdirSync(path.join(__dirname, '/../../public/uploads'));
} catch (err) {
	throw new Error(`Error while creating directories: ${error.message}`);
}

app.use(favicon(path.join(__dirname, '/../../public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, '/../../public')));

// Define view engine and static assets
app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'pug');

app.use(cors());
// Define global middleware for our server
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts({ maxAge: 7776000000 }));
app.use(helmet.frameguard('SAMEORIGIN'));
app.use(helmet.xssFilter({ setOnOldIE: true }));
app.use(helmet.noSniff());

app.use(compression());
app.use(
	cookieParser(config.cookieSecret, {
		httpOnly: true,
		maxAge: 3600000
	})
);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(validateJSON);

// View Route
app.use('/', viewsRoutes);

// API Routes
app.use('/auth', authRoutes);
app.use('/api', ensureLoggedIn, apiRoutes);
// view engine
// app.set('views', path.join(__dirname, '/../views'));
// app.set('view engine', 'ejs')

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (config.env === 'development') {
	app.use(function(err, req, res, next) {
		console.log(err.stack);
		return res
			.status(err.status || 500)
			.json({ message: 'Unhandled Request.', errors: { message: err.message, error: err } });
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	return res
		.status(err.status || 500)
		.json({ message: 'Unhandled Request.', errors: { message: err.message, error: {} } });
});

export default app;

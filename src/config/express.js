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

import config from './config';
import authRoutes from '../routes/auth';
import json from '../middlewares/json';
import * as errorHandler from '../middlewares/errorHandler';

const app = express();
if (config.env === 'development') {
    app.use(logger('dev'));
}

try {
    fs.existsSync(path.join(__dirname, '/../../public')) || fs.mkdirSync(path.join(__dirname, '/../../public'));
    fs.existsSync(path.join(__dirname, '/../../public/uploads')) || fs.mkdirSync(path.join(__dirname, '/../../public/uploads'));
} catch (err) {
    throw new Error(`Error while creating directories: ${error.message}`);
}

app.use(favicon(path.join(__dirname, '/../../public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, '/../../public')));


app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler.bodyParser);
app.use(json);

// API Routes
app.use('/auth', authRoutes);
// app.use('/api', routes);
// view engine
app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'ejs')


// Error Middleware
app.use(errorHandler.genericErrorHandler);
app.use(errorHandler.methodNotAllowed);


export default app;
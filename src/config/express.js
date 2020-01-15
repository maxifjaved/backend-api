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
import routes from '../routes';
import json from '../middlewares/json';
import * as errorHandler from '../middlewares/errorHandler';

import '../db';
import '../services/passport'

// const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs/swagger.json';


const app = express();
if (config.env === 'development') {
    app.use(logger('dev'));
}

try {
    fs.existsSync(path.join(__dirname, '/../public')) || fs.mkdirSync(path.join(__dirname, '/../public'));
    fs.existsSync(path.join(__dirname, '/../public/uploads')) || fs.mkdirSync(path.join(__dirname, '/../public/uploads'));
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
app.use('/api', routes);
// view engine
app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'ejs')



// Swagger UI
// Workaround for changing the default URL in swagger.json
// https://github.com/swagger-api/swagger-ui/issues/4624
// const swaggerIndexContent = fs
//     .readFileSync(`${pathToSwaggerUi}/index.html`)
//     .toString()
//     .replace('https://petstore.swagger.io/v2/swagger.json', '/api/swagger.json');

// app.get('/api-docs/index.html', (req, res) => res.send(swaggerIndexContent));
// app.get('/api-docs', (req, res) => res.redirect('/api-docs/index.html'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use('/api-docs', express.static(pathToSwaggerUi));


// Error Middleware
app.use(errorHandler.genericErrorHandler);
app.use(errorHandler.methodNotAllowed);


export default app;
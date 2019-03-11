import './env';

import fs from 'fs';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import compression from 'compression';

import './db';
import './services/passport'

import routes from './routes';
import json from './middlewares/json';
import logger, { logStream } from './utils/logger';
import * as errorHandler from './middlewares/errorHandler';

const app = express();

const APP_PORT = (process.env.NODE_ENV === 'test' ? process.env.TEST_APP_PORT : process.env.APP_PORT) || process.env.PORT || '3000';
const APP_HOST = process.env.APP_HOST || '0.0.0.0';

// const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';

// Create audio/ and upload/ folders incase they don't already exist
// This is for the heroku platform with its ephemeral filesystem
try {
    fs.existsSync(path.join(__dirname, '/../public')) || fs.mkdirSync(path.join(__dirname, '/../public'));
    fs.existsSync(path.join(__dirname, '/../public/uploads')) || fs.mkdirSync(path.join(__dirname, '/../public/uploads'));
} catch (err) {
    console.log(err);
}



app.set('port', APP_PORT);
app.set('host', APP_HOST);

app.locals.title = process.env.APP_NAME;
app.locals.version = process.env.APP_VERSION;


app.use(favicon(path.join(__dirname, '/../public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, '/../public')));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('tiny', { stream: logStream }));
app.use(bodyParser.json());
app.use(errorHandler.bodyParser);
app.use(json);

// API Routes
app.use('/api', routes);
// view engine
app.set('views', path.join(__dirname, '/../src/views'));
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

// Error Middlewares
app.use(errorHandler.genericErrorHandler);
app.use(errorHandler.methodNotAllowed);

app.listen(app.get('port'), app.get('host'), () => {
    logger.info(`Server started at http://${app.get('host')}:${app.get('port')}/api`);
});

// Catch unhandled rejections
process.on('unhandledRejection', err => {
    logger.error('Unhandled rejection', err);

    logger.error('Raven error', err);
    process.exit(1);
});

// Catch uncaught exceptions
process.on('uncaughtException', err => {
    logger.error('Uncaught exception', err);

    logger.error('Raven error', err);
    process.exit(1);
});

// import mongoose from 'mongoose';
// const UserGroup = mongoose.model('Group');

// (async () => {
//     try {

//         var data = {
//             title: 'Public'
//         }
//         var data1 = {
//             title: 'Private'
//         }
//         var data2 = {
//             title: 'Social'
//         }
//         var userGroup = new UserGroup(data)
//         await userGroup.save()

//         userGroup = new UserGroup(data1)
//         await userGroup.save()

//         userGroup = new UserGroup(data2)
//         await userGroup.save()
//     } catch (error) {
//         console.log(error.toString())
//     }
// })();

export default app;
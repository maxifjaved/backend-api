import config from './config/config';

import './db';
import './services/passport';
import app from './config/express';

app.listen(config.port, config.host, () => {
    console.info(`Server started at http://${config.host}:${config.port} (${config.env})`);
});

// Catch unhandled rejections
process.on('unhandledRejection', err => {
    console.error('Unhandled rejection', err);
    process.exit(1);
});

// Catch uncaught exceptions
process.on('uncaughtException', err => {
    console.error('Uncaught exception', err);
    process.exit(1);
});

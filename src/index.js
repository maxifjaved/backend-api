import config from './config/config'

import './config/mongoose'
import './config/passport'
import app from './config/express'

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
    app.listen(config.port, config.host, () => {
        console.info(`Server started at http://${config.host}:${config.port} (${config.env})`);
    });
}

// Catch unhandled rejections
process.on('unhandledRejection', err => {
    console.error('Unhandled rejection', err);

    console.error('Raven error', err);
    process.exit(1);
});

// Catch uncaught exceptions
process.on('uncaughtException', err => {
    console.error('Uncaught exception', err);

    console.error('Raven error', err);
    process.exit(1);
});



export default app;
import mongoose from 'mongoose';
import fs from 'fs';
import { join } from 'path';

const models = join(__dirname, 'models');

import config from '../config/config';

// Bootstrap models
fs.readdirSync(models)
    .filter(file => ~file.search(/^[^.].*\.js$/))
    .forEach(file => require(join(models, file)));

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    keepAlive: true,
    useCreateIndex: true
};

mongoose.connect(config.mongoUrl, options)
    .then(() => {
        console.log("MongoDB connected [%s]", config.mongoUrl);


    }).catch(err => console.log(err.reason));

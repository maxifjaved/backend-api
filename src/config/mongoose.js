import mongoose from 'mongoose';
import config from './config';


mongoose.connect(config.mongoUrl, { useNewUrlParser: true, keepAlive: true })
    .catch(err => console.log(err.reason));
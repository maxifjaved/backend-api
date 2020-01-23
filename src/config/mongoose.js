import mongoose from 'mongoose';
import config from './config';
import '../models'


mongoose.connect(config.mongoUrl, { useUnifiedTopology: true, useNewUrlParser: true, keepAlive: true })
    .then(() => console.log("MongoDB connected [%s]", config.mongoUrl))
    .catch(err => console.log(err.reason));

import mongoose from 'mongoose';
import config from './config';
import '../models'

const options = { useUnifiedTopology: true, 
    useNewUrlParser: true, 
    keepAlive: true,
    useCreateIndex: true
};

mongoose.connect(config.mongoUrl, options)
    .then(() => console.log("MongoDB connected [%s]", config.mongoUrl))
    .catch(err => console.log(err.reason));

mongoose.set('useFindAndModify', false);


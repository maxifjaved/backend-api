const mongoose = require('mongoose');

const DB_URI = (process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URI : process.env.DB_URI) || 'mongodb://127.0.0.1:27017/backend';


mongoose.Promise = global.Promise;
mongoose.connect(DB_URI, { useNewUrlParser: true });


import './models/user'
import './models/userToken'
import './models/userPost'
import './models/group'
import './models/friend'
import './models/refer'
import fs from 'fs';
import { join } from 'path';

// Bootstrap passport Strategy
fs.readdirSync(__dirname)
.filter(file => ~file.search(/^[^.].*\.js$/))
.forEach(file => require(join(__dirname, file)));

import { Environment } from '../models/environment';

let environment: Environment;

if (process.env.NODE_ENV === 'production') {
    environment = require('./environment.prod').environment;
} else if (process.env.NODE_ENV === 'test') {
    environment = require('./environment.test').environment;
} else {
    environment = require('./environment.local').environment;
}

export default environment;

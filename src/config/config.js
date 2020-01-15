
import Joi from 'joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow(['development', 'production', 'test', 'provision'])
        .default('development'),
    APP_NAME: Joi.string()
        .default('Muhammad Asif Javed <axif.javed@gmail.com> - Backend Api Starter Kit'),
    APP_VERSION: Joi.string()
        .default('1.0.0'),
    SERVER_PORT: Joi.number()
        .default(4040),
    SERVER_HOST: Joi.string()
        .default('127.0.0.1'),
    JWT_SECRET: Joi.string().required()
        .description('JWT Secret required to sign'),
    EMAIL_CONFIRMATION_SECRET: Joi.string().required()
        .description('Email Confirmation Secret required to sign'),
    RESET_PASSWORD_SECRET: Joi.string().required()
        .description('Rest Password Secret required to sign'),
    MONGOOSE_DEBUG: Joi.boolean()
        .when('NODE_ENV', {
            is: Joi.string().equal('development'),
            then: Joi.boolean().default(true),
            otherwise: Joi.boolean().default(false)
        }),
    MONGO_DB_URI: Joi.string().required()
        .description('Mongo DB host url'),
    FRONTEND_URL: Joi.string().required()
        .description('Frontend Url required for social auth'),

}).unknown()
    .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    appName: envVars.APP_NAME,
    appVersion: envVars.APP_VERSION,
    port: envVars.SERVER_PORT,
    host: envVars.SERVER_HOST,
    jwtSecret: envVars.JWT_SECRET,
    emailConfirmationSecret: envVars.EMAIL_CONFIRMATION_SECRET,
    resetPasswordSecret: envVars.RESET_PASSWORD_SECRET,
    mongooseDebug: envVars.MONGOOSE_DEBUG,
    mongoUrl: envVars.MONGO_DB_URI,
    frontend: envVars.FRONTEND_URL
};

export default config;
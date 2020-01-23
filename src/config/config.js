
import Joi from 'joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

const envVarsSchema = Joi.object({
    // General variable validations
    NODE_ENV: Joi.string()
        .allow(['development', 'production', 'test', 'provision'])
        .default('development'),
    APP_NAME: Joi.string()
        .default('Muhammad Asif Javed <axif.javed@gmail.com> - Backend Api Starter Kit'),
    APP_VERSION: Joi.string()
        .default('1.0.0'),

    // Server setup validations
    SERVER_PORT: Joi.number()
        .default(4040),
    SERVER_HOST: Joi.string()
        .default('127.0.0.1'),

    // Email details validations
    EMAIL_HOST: Joi.string().required()
        .description('Email host is required to send emails.'),
    EMAIL_PORT: Joi.string().required()
        .description('Email post is required to setup email service.'),
    EMAIL_USER: Joi.string().required()
        .description('Email address is required to send emails.'),
    EMAIL_PASS: Joi.string().required()
        .description('Email password is required to send emails.'),
    EMAIL_SECURE: Joi.string().required()
        .description('is email service using is secure?'),

    // Secret validations to sign the token for emails and jwt
    JWT_SECRET: Joi.string().required()
        .description('JWT Secret required to sign'),
    EMAIL_CONFIRMATION_SECRET: Joi.string().required()
        .description('Email Confirmation Secret required to sign'),
    RESET_PASSWORD_SECRET: Joi.string().required()
        .description('Rest Password Secret required to sign'),

    // Database details validations
    MONGOOSE_DEBUG: Joi.boolean()
        .when('NODE_ENV', {
            is: Joi.string().equal('development'),
            then: Joi.boolean().default(true),
            otherwise: Joi.boolean().default(false)
        }),
    MONGO_DB_URI: Joi.string().required()
        .description('Mongo DB host url'),

    // Validate the Url to redirect to on social login and verification/password reset.
    FRONTEND_URL: Joi.string().required()
        .description('Frontend Url required for social auth'),
    BACKEND_URL: Joi.string().required()
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

    emailHost: envVars.EMAIL_HOST,
    emailPort: envVars.EMAIL_PORT,
    emailUser: envVars.EMAIL_USER,
    emailPass: envVars.EMAIL_PASS,
    emailSecure: envVars.EMAIL_SECURE,

    jwtSecret: envVars.JWT_SECRET,
    emailConfirmationSecret: envVars.EMAIL_CONFIRMATION_SECRET,
    resetPasswordSecret: envVars.RESET_PASSWORD_SECRET,

    mongooseDebug: envVars.MONGOOSE_DEBUG,
    mongoUrl: envVars.MONGO_DB_URI,

    frontendUrl: envVars.FRONTEND_URL,
    backendUrl: envVars.BACKEND_URL,
};

export default config;
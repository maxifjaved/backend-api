import isEmpty from 'lodash/isEmpty';

/**
 * Middleware to handle empty JSON body requests and other edge cases if any.
 *
 * @param  {Object}   request
 * @param  {Object}   response
 * @param  {Function} next
 */
const validateJSON = (req, res, next) => {
    const { body, method } = req;
    const disallowedHttpHeaders = ['PUT', 'POST', 'PATCH'];

    if (req.is('application/json') && disallowedHttpHeaders.includes(method) && isEmpty(body)) {
        return res.status(500).json({ message: 'Empty JSON', errors: { message: `['PUT', 'POST', 'PATCH'] request are not allowed without body.` } })
    }

    next();
}

export default validateJSON;

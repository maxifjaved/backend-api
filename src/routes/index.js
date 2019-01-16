import { Router } from 'express';

import swaggerSpec from '../utils/swagger';
import users from './users';
import auth from './auth';

/**
 * Contains all API routes for the application.
 */
const router = Router();

/**
 * GET /api/swagger.json
 */
router.get('/swagger.json', (req, res) => {
    res.json(swaggerSpec);
});

/**
 * GET /api
 */
router.get('/', (req, res) => {
    res.json({
        app: req.app.locals.title,
        apiVersion: req.app.locals.version
    });
});

router.use('/auth', auth);
router.use('/users', users);

export default router;
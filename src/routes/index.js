import { Router } from 'express';

import swaggerSpec from '../utils/swagger';

import auth from './auth';
import users from './users';
import tags from './tags';
import posts from './posts';
import group from './groups';
import refer from './refer';

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
router.use('/tags', tags);
router.use('/posts', posts);
router.use('/group', group);
router.use('/refer', refer);

export default router;
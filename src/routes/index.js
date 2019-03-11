import { Router } from 'express';

import auth from './auth';
import users from './users';
import tags from './tags';
import posts from './posts';
import group from './groups';
import invitations from './invitation';
import friends from './friends';

/**
 * Contains all API routes for the application.
 */
const router = Router();

/**
 * GET /api
 */
router.get('/', (req, res) => {
    return res.json({
        app: req.app.locals.title,
        apiVersion: req.app.locals.version
    });
});

router.use('/auth', auth);
router.use('/users', users);
router.use('/tags', tags);
router.use('/posts', posts);
router.use('/group', group);
router.use('/invitations', invitations);
router.use('/friends', friends);

export default router;
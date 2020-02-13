import { Router } from 'express';
import * as controller from './user.controller';

const router = Router();

router
    .post('/update-password', controller.changePassword)
    .patch('/update-profile', controller.updateProfile);

export default router;
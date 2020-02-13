import { Router } from 'express';

import galleryRoute from './gallery/gallery.route';
import userRoute from './user/user.route';

const router = Router();


router.use('/gallery', galleryRoute);
router.use('/user', userRoute);

export default router;

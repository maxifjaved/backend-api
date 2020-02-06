import { Router } from 'express';

import galleryRoute from './gallery/gallery.route';

const router = Router();


router.use('/gallery',  galleryRoute);

export default router;

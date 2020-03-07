import { Router } from 'express';
const router = Router();

router.get('/', (_, res) => res.render('index', { title: 'Backend Api' }));

export default router;

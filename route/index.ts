import { Router } from 'express';
import User from '../Controller/User.controller';
const router = Router();

router.get('/login',User.login)

export default router;

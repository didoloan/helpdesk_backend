import { Router } from 'express';
import userCtrl from './userCtrl';

const router = new Router();

router.route('/login').post(userCtrl.login);

router.route('/register').post(userCtrl.register);

// router.route('/')

export default router;
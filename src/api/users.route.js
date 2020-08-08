import { Router } from 'express';

router = new Router();

router.route('/login').post(userCtrl.login);

router.route('/register').post(userCtrl.register);

// router.route('/')

export default router;
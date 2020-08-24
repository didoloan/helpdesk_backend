import {Router} from 'express';
import requestCtrl from './requestCtrl';
import Auth from './auth';

const router = new Router();

router.route('/add_request').post(Auth.isAuthenticated, requestCtrl.add);

router.route('/update_request').post(Auth.isTechnician, requestCtrl.update);

// router.route('/')

export default router;
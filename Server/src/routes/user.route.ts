import express from 'express';
import { checkAuth, getUserDetails, login, logout, signup } from '../controllers/user.controller';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const router = express.Router();

router.route('/check-auth').get(isAuthenticated, checkAuth);
router.route('/:id/details').get(isAuthenticated, getUserDetails);
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').post(logout);

export default router;
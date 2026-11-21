import Router from 'express';

// CONTROLLERS
import signup from '../controllers/signupController.js';
import {login, logout} from '../controllers/loginController.js';

const router = Router();

// SIGN UP
router.post('/signup', signup);

// LOGIN
router.post('/login', login);

// LOGOUT
router.post('/logout', logout)

export default router;
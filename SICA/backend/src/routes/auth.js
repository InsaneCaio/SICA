import Router from 'express';

// CONTROLLERS
import signup from '../controllers/signup.js';
import {login, logout} from '../controllers/login.js';

const router = Router();

// SIGN UP
router.post('/signup', signup);

// LOGIN
router.post('/login', login);

// LOGOUT
router.post('/logout', logout)

export default router;
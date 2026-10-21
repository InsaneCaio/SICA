import Router from 'express';

// CONTROLLERS
import signup from '../controllers/signup.js';
import login from '../controllers/login.js';

const router = Router();

// SIGN UP
router.get('/signup', signup);

// LOGIN
router.get('/login', login);

export default router;
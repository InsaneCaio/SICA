import Router from 'express';

// CONTROLLERS
import signup from '../controllers/signup.js';
import login from '../controllers/login.js';

const router = Router();

// SIGN UP
router.post('/signup', signup);

// LOGIN
router.post('/login', login);

export default router;
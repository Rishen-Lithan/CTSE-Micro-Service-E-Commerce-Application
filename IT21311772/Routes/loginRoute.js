import express from 'express';
import handleLogin from '../Controllers/loginController.js';

const router = express.Router();

router.post('/', handleLogin);

export default router;
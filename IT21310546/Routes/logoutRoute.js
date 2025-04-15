import express from 'express';
import handleLogout from '../Controllers/logoutController.js';

const router = express.Router();

router.get('/', handleLogout);

export default router;
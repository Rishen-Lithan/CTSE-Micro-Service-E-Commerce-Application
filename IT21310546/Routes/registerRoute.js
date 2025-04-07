import express from 'express'
import { handleNewUser, handleNewVendor } from '../Controllers/registerController.js';

const router = express.Router();

router.route('/')
    .post(handleNewUser);

router.route('/vendor')
    .post(handleNewVendor);
    
export default router;
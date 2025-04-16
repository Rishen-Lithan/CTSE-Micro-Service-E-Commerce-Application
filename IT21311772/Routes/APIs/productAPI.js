import express from 'express';
import { getProductsAPI, getProductByIdAPI, manageQuantity } from '../../Controllers/productController.js';

const router = express.Router();

router.route('/')
    .get(getProductsAPI);

router.route('/:id')
    .get(getProductByIdAPI)
    .patch(manageQuantity);

export default router;
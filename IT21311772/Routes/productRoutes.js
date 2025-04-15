import express from 'express';
import ROLES_LIST from '../Config/ROLES_LIST.js';
import verifyRoles from '../Middlewares/verifyRoles.js';
import { addProduct, getProducts, getProductById, deleteProduct, updateProduct } from '../Controllers/productController.js';

const router = express.Router();

router.route('/')
    .post(verifyRoles(ROLES_LIST.Vendor), addProduct)
    .get(getProducts)
    .delete(verifyRoles(ROLES_LIST.Vendor, ROLES_LIST.Admin), deleteProduct);

router.route('/:id')
    .get(getProductById)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Vendor), updateProduct);

export default router;
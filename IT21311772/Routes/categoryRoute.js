import express from 'express';
import ROLES_LIST from '../Config/ROLES_LIST.js';
import verifyRoles from '../Middlewares/verifyRoles.js';
import { getAllCategories, createCategory, changeCategoryStatus, deleteCategory } from '../Controllers/categoryController.js';

const router = express.Router();

router.route('/')
    .get(getAllCategories)
    .post(verifyRoles(ROLES_LIST.Vendor, ROLES_LIST.Admin), createCategory)
    .put(verifyRoles(ROLES_LIST.Vendor, ROLES_LIST.Admin),changeCategoryStatus)
    .delete(verifyRoles(ROLES_LIST.Admin),deleteCategory);

export default router;
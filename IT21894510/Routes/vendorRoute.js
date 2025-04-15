import express from 'express';
import ROLES_LIST from '../Config/ROLES_LIST.js';
import verifyRoles from '../Middlewares/verifyRoles.js';
import {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor
} from '../Controllers/vendorController.js';

const router = express.Router();

// All routes here are protected by Admin role.
// If you want to allow Vendor to see their own data, or allow other roles, adjust accordingly.

router.route('/')
  .post(verifyRoles(ROLES_LIST.Admin), createVendor)   // CREATE
  .get(getAllVendors);  // READ all

router.route('/:id')
  .get(verifyRoles(ROLES_LIST.Admin), getVendorById)   // READ one
  .put(verifyRoles(ROLES_LIST.Admin), updateVendor)    // UPDATE
  .delete(verifyRoles(ROLES_LIST.Admin), deleteVendor);// DELETE

export default router;

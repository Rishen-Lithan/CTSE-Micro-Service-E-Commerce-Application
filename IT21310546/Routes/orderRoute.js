import express from "express";
import ROLES_LIST from "../Config/ROLES_LIST.js";
import verifyRoles from "../Middlewares/verifyRoles.js";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getUserOrderById,
  getVendorOrders,
  getVendorOrderById,
  changeOrderStatus,
  cancelOrder,
} from "../Controllers/orderController.js";

const router = express.Router();

router.route("/").post(createOrder).get(getAllOrders);

router.route("/user").post(getUserOrders);

router.route("/user-order").post(getUserOrderById);

router
  .route("/vendor")
  .post(verifyRoles(ROLES_LIST.Vendor, ROLES_LIST.Admin), getVendorOrders);

router
  .route("/vendor-order")
  .post(verifyRoles(ROLES_LIST.Vendor, ROLES_LIST.Admin), getVendorOrderById);

router
  .route("/change-status/:id")
  .patch(verifyRoles(ROLES_LIST.Vendor, ROLES_LIST.Admin), changeOrderStatus);

router.route("/cancel-order/:id").patch(cancelOrder);

export default router;

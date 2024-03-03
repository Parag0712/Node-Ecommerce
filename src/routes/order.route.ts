import { Router } from "express";
import { addOrder, deleteOrder, getAllOrders, getSingleOrder, myOrders, processOrder } from "../controllers/order.controllers.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

//For addProduct- /api/v1/order/addOrder
router.route("/addOrder").post(addOrder);

//For myOrders - /api/v1/order/myOrder
router.route("/myOrders").get(myOrders);

//For getAllOrders - /api/v1/order/getAllOrder?id=11
router.route("/getAllOrders").get(verifyAdmin,getAllOrders);

//For singleOrder - /api/v1/order/getAllOrder/orderId
router.route("/getSingleOrder/:orderId").get(getSingleOrder);

//For processOrder - /api/v1/order/processOrder/orderId?id=11
router.route("/processOrder/:orderId").put(verifyAdmin,processOrder);

//For deleteOrder - /api/v1/order/deleteOrder/orderId?id=11
router.route("/deleteOrder/:orderId").delete(verifyAdmin,deleteOrder);

export default router;
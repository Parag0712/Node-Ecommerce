import { Router } from "express";
import { addOrder, myOrder } from "../controllers/order.controllers.js";

const router = Router();

//For addProduct- /api/v1/order/addOrder
router.route("/addOrder").post(addOrder);

//For addProduct- /api/v1/order/myOrder
router.route("/myOrder").get(myOrder);

export default router;
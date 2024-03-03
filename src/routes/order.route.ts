import { Router } from "express";
import { addOrder } from "../controllers/order.controllers.js";

const router = Router();

//For addProduct- /api/v1/order/addOrder
router.route("/addOrder").post(addOrder);

export default router;
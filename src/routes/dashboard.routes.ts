import { Router } from "express";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controllers.js";

const router = Router();

//For addProduct- /api/v1/product/addProduct
router.route("/getStats").get(verifyAdmin, getDashboardStats);

export default router;
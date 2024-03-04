import { Router } from "express";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { getBar, getDashboardStats, getLine, getPie } from "../controllers/dashboard.controllers.js";

const router = Router();

//For getStats- /api/v1/dashboard/getStats?id=11
router.route("/getStats").get(verifyAdmin, getDashboardStats);

//For getPie- /api/v1/dashboard/getPie?id=11
router.route("/getPie").get(verifyAdmin, getPie);

//For getPie- /api/v1/dashboard/getBar?id=11
router.route("/getBar").get(verifyAdmin, getBar);

//For getPie- /api/v1/dashboard/getLine?id=11
router.route("/getLine").get(verifyAdmin, getLine);

export default router;
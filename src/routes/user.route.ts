import { Router } from "express"
import createUser from "../controllers/user.controllers.js";

const router  = Router();
router.route("/createUser").get(createUser); 

export default router;
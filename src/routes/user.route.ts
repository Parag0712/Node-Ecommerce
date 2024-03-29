import { Router } from "express"
import {createUser, deleteUser, getAllUsers, getUser} from "../controllers/user.controllers.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router  = Router();

// Route - /api/v1/users/createUser
router.route("/createUser").post(createUser); 

// Route - /api/v1/users/getAllUsers
router.route("/getAllUsers").get(verifyAdmin,getAllUsers); 

// Route - /api/v1/users/getAllUsers
router.route("/getAllUsers").get(getUser); 

// Route - /api/v1/users/getUser/id
router.route("/getUser/:id").get(getUser); 

// Route - /api/v1/users/deleteUser/id
router.route("/deleteUser/:id").delete(verifyAdmin,deleteUser); 

// router.route("/:id").get(getUser).delete(deleteUser)

export default router;
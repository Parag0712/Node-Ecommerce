import { Router } from "express"
import {createUser, getAllUsers, getUser} from "../controllers/user.controllers.js";

const router  = Router();
// Route - /api/v1/users/createUser
router.route("/createUser").post(createUser); 

// Route - /api/v1/users/getAllUsers
router.route("/getAllUsers").get(getAllUsers); 

// Route - /api/v1/users/getAllUsers
router.route("/getAllUsers").get(getUser); 

// Route - /api/v1/users/id
router.route("/:id").get(getUser); 

export default router;
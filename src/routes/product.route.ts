import { Router } from "express";
import { addProduct, getAllCategories, getAllProduct, latestProduct } from "../controllers/product.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router  = Router();

// => Admin routes
// Route addProduct- /api/v1/product/addProduct
router.route("/addProduct").post(verifyAdmin,upload,addProduct);

// Route getAllProduct- /api/v1/product/getAllProduct
router.route("/getAllProducts").get(verifyAdmin,getAllProduct);


// => User routes
// Route addProduct- /api/v1/product/addProduct
router.route("/addProduct").post(upload,addProduct); 

// Route getLatestProducts - /api/v1/product/getLatestProduct?sort=updateAt&order=desc&limit=10
router.route("/getLatestProduct").get(latestProduct); 

//To get all unique Categories  - /api/v1/product/categories
router.get("/categories", getAllCategories);

export default router;
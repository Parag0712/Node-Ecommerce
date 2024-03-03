import { Router } from "express";
import { addProduct, deleteProduct, getAllCategories, getAllProducts, getSingleProduct, latestProduct, searchProduct, updateProduct } from "../controllers/product.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// => Admin routes
//For addProduct- /api/v1/product/addProduct
router.route("/addProduct").post(verifyAdmin,upload, addProduct);

//For getAllProduct- /api/v1/product/getAllProduct
router.route("/getAllProducts").get(verifyAdmin, getAllProducts);

//For updateProduct  - /api/v1/product/updateProduct/:productId?id
router.put("/updateProduct/:productId", verifyAdmin, upload, updateProduct);

//For deleteProduct  - /api/v1/product/deleteProduct/:productId?id
router.delete("/deleteProduct/:productId", verifyAdmin, deleteProduct);


// => User routes 

//For getLatestProducts - /api/v1/product/getLatestProduct?sort=updateAt&order=desc&limit=10
router.route("/getLatestProduct").get(latestProduct);

//For get all unique Categories  - /api/v1/product/categories
router.get("/categories", getAllCategories);

//For get singleProduct  - /api/v1/product/getSingleProduct/:productId
router.get("/getSingleProduct/:productId", getSingleProduct);

//For search  - /api/v1/product/getSingleProduct/:productId
router.get("/search", searchProduct);

export default router;
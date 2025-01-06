import express from "express";
import { addProduct, getAllProducts, getSingleProduct, deleteProduct, editProduct, uploadImage } from "../controllers/products.controllers.js";
import { upload } from "../middleware/multer.middleware.js";


const router = express.Router();

router.post("/addproduct", addProduct);
router.get("/getallproducts", getAllProducts);
router.get("/getsingleproduct", getSingleProduct);
router.delete("/deleteproduct", deleteProduct);
router.put("/editproduct", editProduct);
router.post("/uploadimage", upload.single("image"), uploadImage);


export default router;
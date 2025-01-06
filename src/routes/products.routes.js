import express from "express";
import { addProduct, getAllProducts, getSingleProduct, deleteProduct, editProduct } from "../controllers/products.controllers.js";


const router = express.Router();

router.post("/addproduct", addProduct);
router.get("/getallproducts", getAllProducts);
router.get("/getsingleproduct", getSingleProduct);
router.delete("/deleteproduct", deleteProduct);
router.put("/editproduct", editProduct);
// router.post("/uploadimage", upload.single("image"), uploadImage);


export default router;
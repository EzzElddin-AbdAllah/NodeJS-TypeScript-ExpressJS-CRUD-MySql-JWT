import express from "express";
import verifyToken from "../middleware/jwtToken";
import {
	getUserProducts,
	getAllProducts,
	createProduct,
	updateProduct,
	deleteProduct,
} from "../controllers/productController";

const router = express.Router();

router.get("/user", verifyToken, getUserProducts);

router.get("/all", getAllProducts);
router.post("/", verifyToken, createProduct);
router.put("/:productId", verifyToken, updateProduct);
router.delete("/:productId", verifyToken, deleteProduct);

export default router;

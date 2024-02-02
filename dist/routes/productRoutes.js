"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtToken_1 = __importDefault(require("../middleware/jwtToken"));
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
router.get("/user", jwtToken_1.default, productController_1.getUserProducts);
router.get("/all", productController_1.getAllProducts);
router.post("/", jwtToken_1.default, productController_1.createProduct);
router.put("/:productId", jwtToken_1.default, productController_1.updateProduct);
router.delete("/:productId", jwtToken_1.default, productController_1.deleteProduct);
exports.default = router;

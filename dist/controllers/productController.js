"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.getUserProducts = exports.getAllProducts = exports.deleteProduct = exports.createProduct = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const getUserProducts = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res
                .status(400)
                .json({ error: "User ID not found in the request" });
        }
        const products = await productModel_1.default.findAll({
            where: { UserId: userId },
        });
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getUserProducts = getUserProducts;
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel_1.default.findAll({
            attributes: { exclude: ["UserId"] },
        });
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getAllProducts = getAllProducts;
const createProduct = async (req, res) => {
    try {
        const { title, image, price } = req.body;
        if (!title || !price) {
            return res.status(400).json({ error: "Title and price are required" });
        }
        if (isNaN(parseFloat(price)) || !isFinite(price)) {
            return res.status(400).json({ error: "Invalid price." });
        }
        const imageUrlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (image && !imageUrlPattern.test(image)) {
            return res.status(400).json({ error: "Invalid image URL format." });
        }
        const newProduct = await productModel_1.default.create({
            title,
            image,
            price,
            UserId: req.user?.id,
        });
        res.json(newProduct);
    }
    catch (error) {
        if (error.name === "SequelizeValidationError" ||
            error.name === "SequelizeUniqueConstraintError") {
            const validationErrors = error.errors.map((err) => ({
                field: err.path,
                message: err.message,
            }));
            return res
                .status(400)
                .json({ error: "Validation Error", details: validationErrors });
        }
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { title, image, price } = req.body;
    try {
        const product = await productModel_1.default.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        if (product.get("UserId") !== req.user?.id) {
            return res.status(403).json({ error: "Permission denied" });
        }
        if (!title && !image && !price) {
            return res
                .status(400)
                .json({ error: "At least one field is required for update" });
        }
        if (title && typeof title !== "string") {
            return res.status(400).json({ error: "Invalid title format" });
        }
        if (image && typeof image !== "string") {
            return res.status(400).json({ error: "Invalid image URL format" });
        }
        if (price && (isNaN(parseFloat(price)) || !isFinite(price))) {
            return res.status(400).json({ error: "Invalid price format" });
        }
        if (title && title !== product.title) {
            const existingProduct = await productModel_1.default.findOne({ where: { title } });
            if (existingProduct) {
                return res
                    .status(400)
                    .json({ error: "Title already exists in another product" });
            }
        }
        await product.update({ title, image, price });
        res.json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await productModel_1.default.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        if (product.get("UserId") !== req.user?.id) {
            return res.status(403).json({ error: "Permission denied" });
        }
        await product.destroy();
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.deleteProduct = deleteProduct;

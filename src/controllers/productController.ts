import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/jwtToken";
import Product, { ProductAttributes } from "../models/productModel";

const getUserProducts = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const userId = req.user?.id as number | undefined;

		if (!userId) {
			return res
				.status(400)
				.json({ error: "User ID not found in the request" });
		}

		const products: Product[] = await Product.findAll({
			where: { UserId: userId } as any,
		});

		res.json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getAllProducts = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const products = await Product.findAll({
			attributes: { exclude: ["UserId"] },
		});
		res.json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const createProduct = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { title, image, price } = req.body;

		if (!title || !price) {
			return res.status(400).json({ error: "Title and price are required" });
		}

		if (isNaN(parseFloat(price)) || !isFinite(price)) {
			return res.status(400).json({ error: "Invalid price." });
		}

		const imageUrlPattern =
			/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
		if (image && !imageUrlPattern.test(image)) {
			return res.status(400).json({ error: "Invalid image URL format." });
		}

		const newProduct = await Product.create({
			title,
			image,
			price,
			UserId: req.user?.id,
		} as ProductAttributes);

		res.json(newProduct);
	} catch (error: any) {
		if (
			error.name === "SequelizeValidationError" ||
			error.name === "SequelizeUniqueConstraintError"
		) {
			const validationErrors = error.errors.map((err: any) => ({
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

const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
	const { productId } = req.params;
	const { title, image, price } = req.body;

	try {
		const product = await Product.findByPk(productId);

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
			const existingProduct = await Product.findOne({ where: { title } });

			if (existingProduct) {
				return res
					.status(400)
					.json({ error: "Title already exists in another product" });
			}
		}

		await product.update({ title, image, price });
		res.json(product);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
	const { productId } = req.params;

	try {
		const product = await Product.findByPk(productId);

		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		if (product.get("UserId") !== req.user?.id) {
			return res.status(403).json({ error: "Permission denied" });
		}

		await product.destroy();
		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export {
	createProduct,
	deleteProduct,
	getAllProducts,
	getUserProducts,
	updateProduct,
};

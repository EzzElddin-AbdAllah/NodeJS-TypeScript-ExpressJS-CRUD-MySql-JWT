import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { testConnection } from "./config/dbConnect";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";

dotenv.config();

const app = express();
const port = 8000;

testConnection();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

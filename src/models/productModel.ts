import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConnect";
import User from "./userModel";

export interface ProductAttributes {
	title: string;
	image: string | null;
	price: number;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
	public title!: string;
	public image!: string | null;
	public price!: number;
}

Product.init(
	{
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		image: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "Product",
	}
);

Product.belongsTo(User);
User.hasMany(Product);

export default Product;

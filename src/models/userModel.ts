import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConnect";

interface UserAttributes {
	id: number;
	username: string;
	password: string;
}

export interface UserCreationAttributes extends Partial<UserAttributes> {}

class User
	extends Model<UserAttributes, UserCreationAttributes>
	implements UserAttributes
{
	public id!: number;
	public username!: string;
	public password!: string;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "User",
	}
);

sequelize.sync();

export default User;

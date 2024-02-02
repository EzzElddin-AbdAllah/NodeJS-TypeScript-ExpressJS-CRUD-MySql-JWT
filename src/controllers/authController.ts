import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { UserCreationAttributes } from "../models/userModel";

interface AuthRequest extends Request {
	body: {
		username: string;
		password: string;
	};
}

const loginUser = async (req: AuthRequest, res: Response) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ where: { username } });

		if (!user) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const token = jwt.sign(
			{ userId: user.id, username: user.username },
			process.env.JWT_SECRET!,
			{
				expiresIn: "1h",
			}
		);

		res.json({ username: user.username, token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const registerUser = async (req: AuthRequest, res: Response) => {
	const { username, password } = req.body;

	try {
		const existingUser = await User.findOne({ where: { username } });

		if (existingUser) {
			return res.status(400).json({ error: "Username is already registered" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			username,
			password: hashedPassword,
		} as UserCreationAttributes);

		const token = jwt.sign(
			{ userId: newUser.id, username: newUser.username },
			process.env.JWT_SECRET!,
			{
				expiresIn: "1h",
			}
		);

		res.json({ username: newUser.username, token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export { loginUser, registerUser };

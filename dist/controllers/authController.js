"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userModel_1.default.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ username: user.username, token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.loginUser = loginUser;
const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await userModel_1.default.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already registered" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await userModel_1.default.create({
            username,
            password: hashedPassword,
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id, username: newUser.username }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ username: newUser.username, token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.registerUser = registerUser;

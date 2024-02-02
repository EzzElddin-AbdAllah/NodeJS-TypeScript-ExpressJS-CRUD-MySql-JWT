"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConnect_1 = require("../config/dbConnect");
const userModel_1 = __importDefault(require("./userModel"));
class Product extends sequelize_1.Model {
}
Product.init({
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    sequelize: dbConnect_1.sequelize,
    modelName: "Product",
});
Product.belongsTo(userModel_1.default);
userModel_1.default.hasMany(Product);
exports.default = Product;

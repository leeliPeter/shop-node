"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfo = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define schema for Product
const productSchema = new mongoose_1.Schema({
    productId: { type: Number, required: true },
    brand: { type: String, required: false },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    size: [{ type: String }],
    category: { type: String, required: true },
    position: { type: String },
    image: [{ type: String }],
    description: { type: String, required: true },
    quantity: [{ size: { type: String }, quantity: { type: Number } }],
    descriptionImg: [{ type: String }],
    publishTime: { type: String, required: true },
    sale: [{ date: { type: String }, number: { type: Number } }],
});
const itemSchema = new mongoose_1.Schema({
    product: productSchema,
    quantity: { type: Number, required: true },
    size: { type: String, required: true }
});
// Define schema for BuyerInfo
const buyerInfoSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zip: { type: String, required: true },
    phone: { type: String, required: true }
});
// Define schema for Order
const orderSchema = new mongoose_1.Schema({
    orderId: { type: String, required: true },
    cart: [itemSchema],
    userId: { type: String, required: false },
    status: { type: String, enum: ["unpaid", "processing", "shipped", "finished"], required: true },
    date: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    buyerInfo: { type: buyerInfoSchema, required: true }
});
const profileSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    birthday: { type: String },
    gender: { type: String },
    phone: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    zip: { type: String },
    address: { type: String }
});
// Define schema for UserInfo
const userInfoSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: '' },
    subscribe: { type: Boolean, default: false },
    cart: [itemSchema],
    orderHistory: [orderSchema],
    registerDate: { type: String, required: true },
    profile: { type: profileSchema, required: true },
    resetToken: { type: String },
    resetTokenExpiry: { type: Number }
});
// Create the model and export it
exports.UserInfo = mongoose_1.default.model('UserInfo', userInfoSchema);

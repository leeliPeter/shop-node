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
exports.OrderModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define schema for Product
const productSchema = new mongoose_1.Schema({
    productId: { type: Number, required: true },
    brand: { type: String, required: false },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0, required: true },
    size: [{ type: String, required: true }],
    category: { type: String, required: true },
    position: { type: String },
    image: [{ type: String, required: true }],
    description: { type: String, required: true },
    quantity: [{
            size: { type: String, required: true },
            quantity: { type: Number, required: true }
        }],
    descriptionImg: [{ type: String, required: true }],
    publishTime: { type: String, required: true },
    sale: [{
            date: { type: String, required: true },
            number: { type: Number, required: true }
        }]
});
// Define schema for Item
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
    cart: [{ type: itemSchema, required: true }], // Use itemSchema instead of Mixed
    userId: { type: String, required: false },
    status: { type: String, enum: ['unpaid', 'processing', 'shipped', 'finished'], required: true },
    date: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    buyerInfo: { type: buyerInfoSchema, required: true } // Properly reference buyerInfoSchema
});
// Create and export the Order model
exports.OrderModel = mongoose_1.default.model('Order', orderSchema);

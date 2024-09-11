"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
const ProductModel = (0, mongoose_1.model)('Product', productSchema);
exports.default = ProductModel;

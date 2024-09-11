import mongoose, { Schema } from 'mongoose';
import { Product, Item, Cart, Order, OrderHistory, UserInfo as IUserInfo, BuyerInfo } from '../types/type';

// Define schema for Product
const productSchema = new Schema<Product>({
    productId: { type: Number, required: true },
    brand:{type:String,required:false},
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

const itemSchema = new Schema<Item>({
    product: productSchema,
    quantity: { type: Number, required: true },
    size: { type: String, required: true }
});

// Define schema for BuyerInfo
const buyerInfoSchema = new Schema<BuyerInfo>({
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
const orderSchema = new Schema<Order>({
    orderId: { type: String, required: true },
    cart: [itemSchema],
    userId: { type: String, required: false },
    status: { type: String, enum: ["unpaid", "processing", "shipped", "finished"], required: true },
    date: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    buyerInfo: { type: buyerInfoSchema, required: true }
});

const profileSchema = new Schema({
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
const userInfoSchema = new Schema<IUserInfo>({
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
export const UserInfo = mongoose.model<IUserInfo>('UserInfo', userInfoSchema);


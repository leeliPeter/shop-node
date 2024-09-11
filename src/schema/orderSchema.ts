import mongoose, { Schema } from 'mongoose';
import { Order, Item, BuyerInfo, Product } from '../types/type'; 

// Define schema for Product
const productSchema = new Schema<Product>({
    productId: { type: Number, required: true },
    brand:{type:String,required:false},
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
    cart: [{ type: itemSchema, required: true }],  // Use itemSchema instead of Mixed
    userId: { type: String, required: false },
    status: { type: String, enum: ['unpaid', 'processing', 'shipped', 'finished'], required: true },
    date: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    buyerInfo: { type: buyerInfoSchema, required: true }  // Properly reference buyerInfoSchema
});

// Create and export the Order model
export const OrderModel = mongoose.model<Order>('Order', orderSchema);

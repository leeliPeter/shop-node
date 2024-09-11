import { Schema, model } from 'mongoose';
import { Product } from '../types/type';

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

const ProductModel = model('Product', productSchema);

export default ProductModel;

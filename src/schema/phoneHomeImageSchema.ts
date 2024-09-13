import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the PhoneHomeImage document
interface IPhoneHomeImage extends Document {
    image: string;
    url: string;
}

// Define the schema for the PhoneHomeImage model
const PhoneHomeImageSchema: Schema = new Schema({
    image: { type: String, required: true },
    url: { type: String, required: true }
});

// Create or retrieve the PhoneHomeImage model
const PhoneHomeImageModel = mongoose.models.PhoneHomeImage || mongoose.model<IPhoneHomeImage>('PhoneHomeImage', PhoneHomeImageSchema);

export default PhoneHomeImageModel;

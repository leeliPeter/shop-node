import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the HomeImage document
interface IHomeImage extends Document {
    image: string;
    url: string;
}

// Define the schema for the HomeImage model
const HomeImageSchema: Schema = new Schema({
    image: { type: String, required: true },
    url: { type: String, required: true }
});

// Create or retrieve the HomeImage model
const HomeImageModel = mongoose.models.HomeImage || mongoose.model<IHomeImage>('HomeImage', HomeImageSchema);

export default HomeImageModel;

import express from 'express';
import ProductModel from '../schema/productSchema'; // Adjust the path as necessary
import HomeImageModel from '../schema/homeImageSchema'; // Adjust the path as necessary
import PhoneHomeImageModel from '../schema/phoneHomeImageSchema';

const router = express.Router();

// Route to get all products
router.get('/products', async (req, res) => {
    try {
        const products = await ProductModel.find(); // Fetch all products from the database
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products.', error });
    }
});

// Route to get a product by productId
router.get('/products/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await ProductModel.findOne({ productId: Number(productId) }).exec(); // Ensure the query is properly typed
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product.', error });
    }
});

// Route to get all home images
router.get('/home-images', async (req, res) => {
    try {
        const homeImages = await HomeImageModel.find(); // Fetch all home images from the database
        res.status(200).json(homeImages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching home images.', error });
    }
});

// Route to get all phone home images
router.get('/phone-home-images', async (req, res) => {
    try {
        const phoneHomeImages = await PhoneHomeImageModel.find(); // Fetch all phone home images from the database
        res.status(200).json(phoneHomeImages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching phone home images.', error });
    }
});

export default router;

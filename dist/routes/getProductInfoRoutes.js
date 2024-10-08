"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productSchema_1 = __importDefault(require("../schema/productSchema")); // Adjust the path as necessary
const homeImageSchema_1 = __importDefault(require("../schema/homeImageSchema")); // Adjust the path as necessary
const phoneHomeImageSchema_1 = __importDefault(require("../schema/phoneHomeImageSchema"));
const router = express_1.default.Router();
// Route to get all products
router.get('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productSchema_1.default.find(); // Fetch all products from the database
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products.', error });
    }
}));
// Route to get a product by productId
router.get('/products/:productId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    try {
        const product = yield productSchema_1.default.findOne({ productId: Number(productId) }).exec(); // Ensure the query is properly typed
        if (product) {
            res.status(200).json(product);
        }
        else {
            res.status(404).json({ message: 'Product not found.' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching product.', error });
    }
}));
// Route to get all home images
router.get('/home-images', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const homeImages = yield homeImageSchema_1.default.find(); // Fetch all home images from the database
        res.status(200).json(homeImages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching home images.', error });
    }
}));
// Route to get all phone home images
router.get('/phone-home-images', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phoneHomeImages = yield phoneHomeImageSchema_1.default.find(); // Fetch all phone home images from the database
        res.status(200).json(phoneHomeImages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching phone home images.', error });
    }
}));
exports.default = router;

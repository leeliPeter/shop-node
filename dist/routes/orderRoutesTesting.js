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
const orderSchema_1 = require("../schema/orderSchema"); // Import the Mongoose model
const router = express_1.default.Router();
// POST /order - Create a new order
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('order upload');
    try {
        const orderData = req.body;
        // Create a new order without generating orderId on the backend
        const newOrder = new orderSchema_1.OrderModel(Object.assign({}, orderData));
        yield newOrder.save();
        res.status(201).json({
            message: 'Order created successfully',
            order: newOrder,
        });
    }
    catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// GET /order/:orderId - Retrieve order by ID
router.get('/:orderId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    try {
        // Find the order by ID
        const order = yield orderSchema_1.OrderModel.findOne({ orderId: orderId }).exec();
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    }
    catch (error) {
        console.error('Error retrieving order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = router;

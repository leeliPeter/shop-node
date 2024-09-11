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
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = express_1.default.Router();
// Configure Nodemailer transporter
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail', // or any other email service
    auth: {
        user: 'lei23lei91@gmail.com', // your email
        pass: 'syau qucz ylcf tsgn', // your email password or app-specific password
    },
});
// POST /order - Create a new order and send payment email
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderData = req.body;
        // Create a new order
        const newOrder = new orderSchema_1.OrderModel(Object.assign({}, orderData));
        yield newOrder.save();
        // Send payment email to buyer
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: newOrder.buyerInfo.email, // Buyer's email from the order
            subject: `Payment required for Order #${newOrder.orderId}`,
            html: `
    <h1>Thank you for your order!</h1>
    <p>Hello ${newOrder.buyerInfo.firstName},</p>
    <p>We have received your order with order ID <strong>${newOrder.orderId}</strong>.</p>
    <p>Please complete your payment to finalize the order.</p>
    <p>Total amount: <strong>$${newOrder.totalPrice.toFixed(2)}</strong></p>
    <p>In order to process your order, please e-transfer the total amount of $${newOrder.totalPrice.toFixed(2)} to <strong>lei23lei91@gmail.com</strong> and include your order ID: <strong>${newOrder.orderId}</strong> in the message section.</p>
    <p>If you have any questions, feel free to contact us.</p>
    <p>Best regards,</p>
    <p>Peter's Shop</p>
      `,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending payment email' });
            }
            console.log('Payment email sent:', info.response);
            res.status(201).json({
                message: 'Order created and payment email sent successfully',
                order: newOrder,
            });
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

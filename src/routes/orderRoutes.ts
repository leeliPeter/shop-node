import express, { Request, Response } from 'express';
import { OrderModel } from '../schema/orderSchema'; // Import the Mongoose model
import nodemailer from 'nodemailer';

const router = express.Router();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any other email service
  auth: {
    user: 'lei23lei91@gmail.com', // your email
    pass: 'syau qucz ylcf tsgn', // your email password or app-specific password
  },
});

// POST /order - Create a new order and send payment email
router.post('/', async (req: Request, res: Response) => {
  try {
    const orderData = req.body;

    // Create a new order
    const newOrder = new OrderModel({
      ...orderData,
    });

    await newOrder.save();

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
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /order/:orderId - Retrieve order by ID
router.get('/:orderId', async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    // Find the order by ID
    const order = await OrderModel.findOne({ orderId: orderId }).exec();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error retrieving order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

import express, { Request, Response } from 'express';
import { OrderModel } from '../schema/orderSchema'; // Import the Mongoose model

const router = express.Router();

// POST /order - Create a new order
router.post('/', async (req: Request, res: Response) => {
  console.log('order upload');
  try {
    const orderData = req.body;

    // Create a new order without generating orderId on the backend
    const newOrder = new OrderModel({
      ...orderData,
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder,
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

import express, { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { UserInfo } from '../schema/userInfo';

const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '399574814517-8e8bv109negr0b0odgl3mbficed3qgnc.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Route to handle Google login
router.post('/', async (req: Request, res: Response) => {
    const { token } = req.body;
  
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
  
    try {
      // Verify and process the token, and send back user info
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
  
      if (!payload) {
        return res.status(400).json({ message: 'Invalid token' });
      }
  
      const { sub: googleId, email, name } = payload;
  
      // Use a fallback value for 'name' if it's undefined
      const userName = name || email;

      let user = await UserInfo.findOne({ email });
  
      if (!user) {
        const userId = `user-${Date.now()}`;
  
        user = new UserInfo({
          userId,
          name: userName,
          email,
          password: '', // You may still need this if it's required by schema
          subscribe: false,
          cart: [],
          orderHistory: [],
          registerDate: new Date().toISOString(),
          profile: {
            email: email,
            firstName: '',
            lastName: '',
            phone: '',
            country: '',
            state: '',
            city: '',
            zip: '',
            address: ''
          }
        });
  
        await user.save();
      }
  
      req.session.user = {
        userId: user.userId,
        email: user.email,
        name: user.name,
      };
  
      res.json({
        message: 'Google login successful',
        userInfo: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          cart: user.cart,
          orderHistory: user.orderHistory,
          registerDate: user.registerDate,
          profile: user.profile,
        }
      });
    } catch (error) {
      console.error('Error during Google login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
export default router;

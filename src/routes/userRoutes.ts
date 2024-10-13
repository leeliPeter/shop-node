import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserInfo } from '../schema/userInfo';
import { DateTime } from 'luxon';
import fs from 'fs';
import path from 'path';


const router = express.Router();

// Route to handle the registration form submission

router.post('/register', async (req: Request, res: Response) => {
    const { name, email, password, subscribe } = req.body;

    try {
        const userId = `user-${Date.now()}`;
        const userName = name || email;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserInfo({
            userId,
            name: userName,
            email,
            password: hashedPassword,
            subscribe: subscribe || false,
            cart: [],
            orderHistory: [],
            registerDate: new Date().toISOString(),
            profile: {
                email: email,
                firstName: '',
                lastName: '',
                birthday: '',
                gender: '',
                phone: '',
                country: '',
                state: '',
                city: '',
                zip: '',
                address: ''
            }
        });

        await newUser.save();

        req.session.user = {
            userId: newUser.userId,
            email: newUser.email,
            name: newUser.name
        };

        res.json({
            message: 'Registration successful!',
            userInfo: {
                userId: newUser.userId,
                name: newUser.name,
                email: newUser.email,
                cart: newUser.cart,
                orderHistory: newUser.orderHistory,
                registerDate: newUser.registerDate,
                profile: newUser.profile
            }
        });
    } catch (error: any) {
        console.error('Error during registration:', error);

        if (error.code === 11000 && error.keyValue) {
            res.status(400).json({ message: `The email is already in use.` });
        } else {
            res.status(500).json({ message: 'Registration failed. Please try again later.' });
        }
    }
});


// Route to handle the login form submission

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await UserInfo.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            req.session.user = {
                userId: user.userId,
                email: user.email,
                name: user.name
            };

            res.json({
                message: 'Login successful!',
                userInfo: {
                    userId: user.userId,
                    name: user.name,
                    email: user.email,
                    cart: user.cart,
                    orderHistory: user.orderHistory,
                    registerDate: user.registerDate,
                    profile: user.profile
                }
            });
        } else {
            res.status(400).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Login failed. Please try again later.' });
    }
});

// Route to handle user logout and clear the session
router.post('/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ message: 'Logout failed. Please try again later.' });
        }

        res.status(200).json({ message: 'Logout successful.' });
    });
});

// Route to get the current user info if session exists
router.get('/current-user', (req: Request, res: Response) => {
    // Assuming location is sent in the query parameters
    const userLocation = req.query.location || 'Location not provided';
    
    // Get current date and time in UTC
    const nowUTC = DateTime.utc();
    
    // Convert to Toronto time (America/Toronto)
    const torontoTime = nowUTC.setZone('America/Toronto');
    
    // Prepare the data to write
    const dataToWrite = `User location: ${userLocation}\nToronto local time: ${torontoTime.toLocaleString(DateTime.DATETIME_MED)}\n\n`;
    
    // Create the path to vistordata.txt outside of shop-node
    const filePath = path.join(__dirname, '..', 'vistordata.txt');

    // Write data to vistordata.txt
    fs.appendFile(filePath, dataToWrite, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data written to vistordata.txt');
        }
    });

    // Check for user session
    if (!req.session.user) {
        console.log("No session found");
        return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('Session found');
    console.log(req.session.user);
    res.json(req.session.user);
});


export default router;

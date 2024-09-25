import express from 'express';
import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import path from 'path';
import userRoutes from './routes/userRoutes';
import userUpdateRoutes from './routes/userUpdateRoutes';
import resetPwdRoutes from './routes/resetPwdRoutes';
import googleLoginRoutes from './routes/googleLoginRoutes';
import uploadRoutes from './productRoutes/uploadRoutes';
import getProductInfoRoutes from './routes/getProductInfoRoutes';
import orderRoutes from './routes/orderRoutes';
import url from './types/type';

const app = express();
const port = 3001;

const allowedOrigins = ['http://localhost:5173', url];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// MongoDB connection
const uri = "mongodb+srv://manager:12345678a@cluster0.63awn.mongodb.net/myShop?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: uri, collectionName: 'sessions' }),
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600 * 1000,
    }
}));

// API routes
app.use('/user', userRoutes);
app.use('/user-update', userUpdateRoutes);
app.use('/reset-password', resetPwdRoutes);
app.use('/google-login', googleLoginRoutes);
app.use('/upload', uploadRoutes);
app.use('/get-product', getProductInfoRoutes);
app.use('/order', orderRoutes);

// Serve static files from react-dist
app.use(express.static(path.join(__dirname, '../react-dist')));

// Serve the frontend app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../react-dist/index.html'));
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Handle process termination gracefully
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(); // Close MongoDB connection
        process.exit(0);
    });
});


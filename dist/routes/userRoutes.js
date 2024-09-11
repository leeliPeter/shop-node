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
const bcrypt_1 = __importDefault(require("bcrypt"));
const userInfo_1 = require("../schema/userInfo");
const router = express_1.default.Router();
// Route to handle the registration form submission
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, subscribe } = req.body;
    try {
        const userId = `user-${Date.now()}`;
        const userName = name || email;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new userInfo_1.UserInfo({
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
        yield newUser.save();
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
    }
    catch (error) {
        console.error('Error during registration:', error);
        if (error.code === 11000 && error.keyValue) {
            res.status(400).json({ message: `The email is already in use.` });
        }
        else {
            res.status(500).json({ message: 'Registration failed. Please try again later.' });
        }
    }
}));
// Route to handle the login form submission
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userInfo_1.UserInfo.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
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
        }
        else {
            res.status(400).json({ message: 'Invalid email or password.' });
        }
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Login failed. Please try again later.' });
    }
}));
// Route to handle user logout and clear the session
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ message: 'Logout failed. Please try again later.' });
        }
        res.status(200).json({ message: 'Logout successful.' });
    });
});
// Route to get the current user info if session exists
router.get('/current-user', (req, res) => {
    if (!req.session.user) {
        console.log('No session found');
        return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log('Session found');
    console.log(req.session.user);
    res.json(req.session.user);
});
exports.default = router;
